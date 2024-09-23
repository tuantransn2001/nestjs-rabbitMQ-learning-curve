import { Injectable } from '@nestjs/common';
import { UserRepositoryInject } from './persistence/user.repository';
import { UserRepository } from 'shared/respositories/user/user.repository';
import { UserSchemaClass } from 'shared/schemas/user/user.schema';
import mongoose from 'mongoose';
import {
  PagingRequest,
  RequestUtil,
} from 'shared/common/utils/request/request-utils';
import { UserResponse } from './dto/user.response';
import { CacheManagerServiceInject } from 'libs/common/cache-manager/persistence/cache-manager.service';
import { CacheManagerService } from 'libs/common/cache-manager/cache-manager.service';

export interface UserService {
  getProfile(_id: mongoose.Types.ObjectId): Promise<UserResponse>;
  getListUser(
    paginationRequest: [PagingRequest, string[][]],
  ): Promise<UserResponse[]>;
  getOne(filter: Partial<UserSchemaClass>): Promise<UserSchemaClass>;
}

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @UserRepositoryInject()
    private readonly userRepository: UserRepository,
    @CacheManagerServiceInject()
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  public async getOne(filter: Partial<UserSchemaClass>) {
    return this.userRepository.findOneByCondition(filter);
  }

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
