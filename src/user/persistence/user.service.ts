import { Inject, Provider } from '@nestjs/common';
import { UserServiceImpl } from '../user.service';

const PROVIDER_NAME = 'USER_SERVICE';

export const UserServiceProvider: Provider = {
  provide: PROVIDER_NAME,
  useClass: UserServiceImpl,
};

export const UserServiceInject = () => Inject(PROVIDER_NAME);
