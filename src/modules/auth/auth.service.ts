import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryInject } from '../user/persistence/user.repository';
import { UserRepository } from '../user/repository/user.repository';
import {
  UserSchemaClass,
  UserSchemaDocument,
} from '../user/entities/user.schema';
import { PasswordEncrypt } from 'src/common/utils/encrypt/password-enscrypt';
import { LoginResponse } from './dto/auth.response.dto';
import { UserResponse } from '../user/dto/user.response';
import mongoose from 'mongoose';
import { AuthTokenRepositoryInject } from '../auth-token/persistence/auth-token.repository';
import { AuthTokenRepository } from '../auth-token/repository/auth-token.repository';
import { AuthTokenSchemaClass } from '../auth-token/entities/auth-token.entity';

export interface AuthService {
  authentication(email: string, password: string): Promise<UserSchemaDocument>;
  login(user: UserSchemaClass): Promise<LoginResponse>;
  logout(token: string): Promise<any>;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @UserRepositoryInject()
    private readonly userRepository: UserRepository,
    @AuthTokenRepositoryInject()
    private readonly authTokenRepository: AuthTokenRepository,
  ) {}

  public async logout(token): Promise<any> {
    try {
      await this.authTokenRepository.deleteOne({
        token,
      });
      return {
        success: true,
        message: 'Logout successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error in logout process');
    }
  }

  private userMapper(user: UserSchemaClass): UserResponse {
    return {
      _id: user._id as mongoose.Types.ObjectId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async authentication(
    email: string,
    password: string,
  ): Promise<UserSchemaDocument> {
    const user = await this.userRepository.findByEmail(email);

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

  public async login(user: UserSchemaClass): Promise<LoginResponse> {
    const token = this.userRepository.generateToken(user);

    // ? Store token in database
    await this.authTokenRepository.create({
      _id: AuthTokenSchemaClass.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user._id,
      token: token.accessToken,
    });

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
