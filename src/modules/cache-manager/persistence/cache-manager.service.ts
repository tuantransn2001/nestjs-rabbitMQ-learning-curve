import { Inject, Provider } from '@nestjs/common';
import { CacheManagerServiceImpl } from '../cache-manager.service';

const PROVIDER_NAME = 'CACHE_MANAGER_SERVICE';

export const CacheManagerProvider: Provider = {
  provide: PROVIDER_NAME,
  useClass: CacheManagerServiceImpl,
};

export const CacheManagerServiceInject = () => Inject(PROVIDER_NAME);
