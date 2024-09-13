import type { RedisClientOptions } from 'redis';
import { Module } from '@nestjs/common';
import { CacheManagerProvider } from './persistence/cache-manager.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CACHE_MANAGER,
  Cache,
  CacheModule,
  CacheStoreFactory,
} from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore as unknown as CacheStoreFactory,
          host: config.get<string>('redisHost'),
          port: config.get<number>('redisPort'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    CacheManagerProvider,
    {
      provide: CACHE_MANAGER,
      useExisting: Cache,
    },
  ],
})
export class CacheManagerModule {}
