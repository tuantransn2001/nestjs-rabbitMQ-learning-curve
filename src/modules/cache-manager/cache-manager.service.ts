import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

export interface CacheManagerService {}

@Injectable()
export class CacheManagerServiceImpl implements CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
}
