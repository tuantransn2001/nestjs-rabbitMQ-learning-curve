import { Injectable } from '@nestjs/common';

export interface UserService {}

@Injectable()
export class UserServiceImpl implements UserService {}
