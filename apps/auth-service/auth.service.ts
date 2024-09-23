import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserSchemaClass,
  UserSchemaDocument,
} from 'shared/schemas/user/user.schema';
import { PasswordEncrypt } from 'shared/common/utils/encrypt/password-enscrypt';
import { LoginResponse, TokenPayload } from './dto/auth.response.dto';
import { UserResponse } from '../user-service/dto/user.response';
import mongoose from 'mongoose';
import { AuthTokenSchemaClass } from 'shared/schemas/auth-token/auth-token.schema';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_TOKEN_SERVICE } from 'apps/auth-token-service/constants/service';
import { AUTH_TOKEN_EVENT } from 'apps/auth-token-service/constants/event';
import { lastValueFrom } from 'rxjs';
import { USER_SERVICE } from 'apps/user-service/constants/service';
import { USER_EVENT } from 'apps/user-service/constants/event';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface AuthService {
  authentication(email: string, password: string): Promise<UserSchemaDocument>;
  login(user): Promise<LoginResponse>;
  logout(token: string): Promise<{
    success: boolean;
    message: string;
  }>;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: ClientProxy,
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async logout(token: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await lastValueFrom(
        this.authTokenService.emit(AUTH_TOKEN_EVENT.DELETE, token),
      );
      return {
        success: true,
        message: 'Logout successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in logout process');
    }
  }

  private userMapper(user): UserResponse {
    return {
      _id: user._id as mongoose.Types.ObjectId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async getUserByEmail(
    email: string,
  ): Promise<UserSchemaDocument | null> {
    let user;
    try {
      user = await lastValueFrom(
        this.userService.send(USER_EVENT.GET_ONE, {
          email,
        }),
      );
    } catch (error) {
      user = null;
      console.error('Error in get user by email', error);
    }

    return user;
  }

  public async authentication(
    email: string,
    password: string,
  ): Promise<UserSchemaDocument> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.deletedAt !== null) {
      throw new UnauthorizedException('User is not active');
    }

    const validatePassword = await PasswordEncrypt.comparePassword(
      password,
      user.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException("Password doesn't match");
    }

    return user;
  }

  private generateToken(user: UserSchemaClass): {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpire: number;
    lifeTime: number;
    refreshLifeTime: number;
  } {
    const payload: TokenPayload = {
      sub: user._id as mongoose.Types.ObjectId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const data = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.private_key'),
        expiresIn: this.configService.get<string>('jwt.life_time'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.refresh_key'),
        expiresIn: this.configService.get<string>('jwt.refresh_life_time'),
      }),
    };

    const expiresIn = this.jwtService.decode(data.refreshToken);

    return {
      ...data,
      refreshTokenExpire: expiresIn?.exp as number,
      lifeTime: this.configService.get<number>('jwt.life_time'),
      refreshLifeTime: this.configService.get<number>('jwt.refresh_life_time'),
    };
  }

  public async login(user: UserSchemaClass): Promise<LoginResponse> {
    const token = this.generateToken(user);

    try {
      await lastValueFrom(
        this.authTokenService.emit(AUTH_TOKEN_EVENT.CREATE, {
          _id: AuthTokenSchemaClass.generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user._id,
          token: token.accessToken,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Error in create token process');
    }

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      refreshTokenExpire: token.refreshTokenExpire,
      lifeTime: token.lifeTime,
      refreshLifeTime: token.refreshLifeTime,
      user: this.userMapper(user),
    };
  }
}
