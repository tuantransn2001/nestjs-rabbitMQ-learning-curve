import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceProvider } from './persistence/user.service';
import { UserService, UserServiceImpl } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServiceProvider],
    }).compile();

    service = module.get<UserService>(UserServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
