import { Module } from '@nestjs/common';
import { AuthTokenServiceProvider } from './persistence/auth-token.service';
import { AuthTokenController } from './auth-token.controller';
import { AuthTokenRepositoryProvider } from './persistence/auth-token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthTokenSchema } from 'shared/schemas/auth-token/auth-token.schema';
import { DatabaseCollection } from 'shared/common/utils/database/database-collection';
import { DatabaseModule } from 'libs/common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ENVConfig } from 'shared/config/configuration';
import { RabbitMqServiceImpl } from 'libs/common/rabbit-mq/rabbit-mq.service';
import { RabbitMqServiceProvider } from 'libs/common/rabbit-mq/persistence/rabbit-mq.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENVConfig],
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: DatabaseCollection.COLLECTION_AUTH_TOKEN,
        schema: AuthTokenSchema,
      },
    ]),
  ],
  providers: [
    AuthTokenServiceProvider,
    AuthTokenRepositoryProvider,
    RabbitMqServiceImpl,
    RabbitMqServiceProvider,
  ],
  controllers: [AuthTokenController],
})
export class AuthTokenModule {}
