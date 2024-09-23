import { Inject, Provider } from '@nestjs/common';
import { UserRepositoryImpl } from 'shared/respositories/user/user.repository';

const PROVIDER_NAME = 'USER_REPOSITORY';

export const UserRepositoryProvider: Provider = {
  provide: PROVIDER_NAME,
  useClass: UserRepositoryImpl,
};

export const UserRepositoryInject = () => Inject(PROVIDER_NAME);