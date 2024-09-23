import type { RedisClientOptions } from 'redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        return {
          store: await redisStore.redisStore({
            socket: {
              host: config.get<string>('redis.host'),
              port: config.get<number>('redis.port'),
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class CacheManagerModule {}
