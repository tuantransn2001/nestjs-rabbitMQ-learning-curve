import { Inject, Provider } from '@nestjs/common';
import { AuthServiceImpl } from '../auth.service';

const PROVIDER_NAME = 'AUTH_SERVICE';

export const AuthServiceProvider: Provider = {
  provide: PROVIDER_NAME,
  useClass: AuthServiceImpl,
};

export const AuthServiceInject = () => Inject(PROVIDER_NAME);
