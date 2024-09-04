import { Injectable } from '@nestjs/common';
import { UserRepositoryInject } from './persistence/user.repository';
import { UserRepository } from './repository/user.repository';

export interface UserService {}

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @UserRepositoryInject()
    private readonly userRepository: UserRepository,
  ) {}
}
