import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENVConfig } from 'src/config/configuration';
import { RabbitMqServiceImpl } from 'src/rabbit-mq/rabbit-mq.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENVConfig],
    }),
  ],
  providers: [RabbitMqServiceImpl],
  controllers: [UserController],
})
export class UserModule {}
