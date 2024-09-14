import { Injectable } from '@nestjs/common';
import { UserRepositoryInject } from './persistence/user.repository';
import { UserRepository } from './repository/user.repository';
import { UserSchemaClass } from './entities/user.schema';
import mongoose from 'mongoose';
import {
  PagingRequest,
  RequestUtil,
} from 'src/common/utils/request/request-utils';
import { UserResponse } from './dto/user.response';

export interface UserService {
  getProfile(_id: mongoose.Types.ObjectId): Promise<UserResponse>;
  getListUser(
    paginationRequest: [PagingRequest, string[][]],
  ): Promise<UserResponse[]>;
}

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @UserRepositoryInject()
    private readonly userRepository: UserRepository,
  ) {}

  public async getListUser(
    paginationRequest: [PagingRequest, string[][]],
  ): Promise<UserResponse[]> {
    const [pagination, sort] = paginationRequest;

    const foundUsers = await this.userRepository.findAll(
      {
        deletedAt: null,
      },
      undefined,
      {
        limit: pagination.limit,
        skip: pagination.offset,
        ...(sort?.length > 0 && {
          sort: {
            [sort[0][0]]: RequestUtil.getSortOrder(sort[0][1] || 'ASC'),
          },
        }),
      },
    );

    return foundUsers.map(UserSchemaClass.toDto);
  }

  public async getProfile(_id: mongoose.Types.ObjectId): Promise<UserResponse> {
    const toObjectId = new mongoose.Types.ObjectId(_id);
    const foundProfile = await this.userRepository.pureOne(toObjectId);
    return UserSchemaClass.toDto(foundProfile);
  }
}
