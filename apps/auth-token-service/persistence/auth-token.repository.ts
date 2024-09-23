import { Inject } from '@nestjs/common';
import { AuthTokenRepositoryImpl } from 'shared/respositories/auth-token/auth-token.repository';

const PROVIDER_NAME = 'AUTH_TOKEN_REPOSITORY';

export const AuthTokenRepositoryProvider = {
  provide: PROVIDER_NAME,
  useClass: AuthTokenRepositoryImpl,
};

export const AuthTokenRepositoryInject = () => Inject(PROVIDER_NAME);
