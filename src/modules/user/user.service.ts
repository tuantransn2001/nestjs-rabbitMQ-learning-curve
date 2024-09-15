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
import { CacheManagerServiceInject } from '../cache-manager/persistence/cache-manager.service';
import { CacheManagerService } from '../cache-manager/cache-manager.service';

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
    @CacheManagerServiceInject()
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  public async getListUser(
    paginationRequest: [PagingRequest, string[][]],
  ): Promise<UserResponse[]> {
    const [pagination, sort] = paginationRequest;

    const fromCache = await this.cacheManagerService.get<UserResponse[]>(
      JSON.stringify(paginationRequest),
    );

    if (fromCache) {
      return fromCache;
    }

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

    const userDtos = foundUsers.map(UserSchemaClass.toDto);

    await this.cacheManagerService.set<UserResponse[]>(
      JSON.stringify(paginationRequest),
      userDtos,
    );

    return userDtos;
  }

  public async getProfile(_id: mongoose.Types.ObjectId): Promise<UserResponse> {
    const toObjectId = new mongoose.Types.ObjectId(_id);

    const fromCache = await this.cacheManagerService.get<UserResponse>(
      toObjectId.toHexString(),
    );

    if (fromCache) {
      return fromCache;
    }

    const foundProfile = await this.userRepository.pureOne(toObjectId);

    const profileDto = UserSchemaClass.toDto(foundProfile);

    await this.cacheManagerService.set<UserResponse>(
      toObjectId.toHexString(),
      profileDto,
    );

    return profileDto;
  }
}
