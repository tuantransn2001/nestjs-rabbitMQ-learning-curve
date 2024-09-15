import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CacheManagerService {
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T): Promise<boolean>;
  deleteOneByKey(key: string): Promise<boolean>;
}

@Injectable()
export class CacheManagerServiceImpl implements CacheManagerService {
  public readonly DEFAULT_TTL: number;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.DEFAULT_TTL =
      this.configService.get<number>('cache.ttl') || 60 * 60 * 24;
  }

  public async get<T>(key: string): Promise<T> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      console.error('Error getting cache', error);
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      await this.cacheManager.set(
        key,
        value,
        ttl && ttl > 0 ? ttl : this.DEFAULT_TTL,
      );
      return true;
    } catch (error) {
      console.error('Error setting cache', error);
      return false;
    }
  }

  public async deleteOneByKey(key: string): Promise<boolean> {
    try {
      await this.cacheManager.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting cache', error);
      return false;
    }
  }
}
