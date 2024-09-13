import { Injectable } from '@nestjs/common';
import { UserRepositoryInject } from './persistence/user.repository';
import { UserRepository } from './repository/user.repository';
import { UserSchemaClass } from './entities/user.schema';
import mongoose from 'mongoose';

export interface UserService {
  getProfile(_id: mongoose.Types.ObjectId): Promise<{
    _id: mongoose.Types.ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @UserRepositoryInject()
    private readonly userRepository: UserRepository,
  ) {}

  public async getProfile(_id: mongoose.Types.ObjectId): Promise<{
    _id: mongoose.Types.ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const toObjectId = new mongoose.Types.ObjectId(_id);
    const foundProfile = await this.userRepository.pureOne(toObjectId);
    return UserSchemaClass.toDto(foundProfile);
  }
}
