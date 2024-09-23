import { Inject, Provider } from '@nestjs/common';
import { AuthTokenServiceImpl } from '../auth-token.service';

const PROVIDER_NAME = 'AUTH_TOKEN_SERVICE';

export const AuthTokenServiceProvider: Provider = {
  provide: PROVIDER_NAME,
  useClass: AuthTokenServiceImpl,
};

export const AuthTokenServiceInject = () => Inject(PROVIDER_NAME);
