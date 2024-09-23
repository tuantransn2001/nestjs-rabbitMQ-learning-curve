import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { CacheManagerProvider } from '../../libs/common/cache-manager/persistence/cache-manager.service';
import { ConfigModule } from '@nestjs/config';
import { ENVConfig } from 'shared/config/configuration';
import { CacheManagerModule } from 'libs/common/cache-manager/cache-manager.module';
import { RabbitMqModule } from 'libs/common/rabbit-mq/rabbit-mq.module';
import { RabbitMqServiceImpl } from 'libs/common/rabbit-mq/rabbit-mq.service';
import { UserServiceProvider } from './persistence/user.service';
import { UserRepositoryProvider } from './persistence/user.repository';
import { DatabaseModule } from 'libs/common/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollection } from 'shared/common/utils/database/database-collection';
import { UserSchema } from 'shared/schemas/user/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENVConfig],
    }),
    CacheManagerModule,
    RabbitMqModule,
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: DatabaseCollection.COLLECTION_USER,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    JwtService,
    CacheManagerProvider,
    RabbitMqServiceImpl,
    UserServiceProvider,
    UserRepositoryProvider,
  ],
  controllers: [UserController],
})
export class UserModule {}
