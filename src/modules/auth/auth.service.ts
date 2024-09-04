import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryInject } from '../user/persistence/user.repository';
import { UserRepository } from '../user/repository/user.repository';
import {
  UserSchemaClass,
  UserSchemaDocument,
} from '../user/entities/user.schema';
import { PasswordEncrypt } from 'src/common/utils/enscrypt/password-enscrypt';
import { LoginResponse } from './dto/auth.response.dto';
import { UserResponse } from '../user/dto/user.response';
import mongoose from 'mongoose';

export interface AuthService {
  authentication(email: string, password: string): Promise<UserSchemaDocument>;
  login(user: UserSchemaClass): LoginResponse;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @UserRepositoryInject()
    private readonly userRepository: UserRepository,
  ) {}

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

  public login(user: UserSchemaClass): LoginResponse {
    const token = this.userRepository.generateToken(user);

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