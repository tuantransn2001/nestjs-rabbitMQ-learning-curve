import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthServiceProvider } from './persistence/auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CacheManagerProvider } from 'libs/common/cache-manager/persistence/cache-manager.service';
import { ENVConfig } from 'shared/config/configuration';
import { CacheManagerModule } from 'libs/common/cache-manager/cache-manager.module';
import { RabbitMqModule } from 'libs/common/rabbit-mq/rabbit-mq.module';
import { AUTH_TOKEN_SERVICE } from 'apps/auth-token-service/constants/service';
import { USER_SERVICE } from 'apps/user-service/constants/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENVConfig],
    }),
    CacheManagerModule,
    RabbitMqModule.register({
      name: AUTH_TOKEN_SERVICE,
    }),
    RabbitMqModule.register({
      name: USER_SERVICE,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthServiceProvider,
    LocalStrategy,
    JwtStrategy,
    CacheManagerProvider,
    JwtService,
  ],
})
export class AuthModule {}
