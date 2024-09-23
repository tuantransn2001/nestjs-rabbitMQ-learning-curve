import { NestFactory } from '@nestjs/core';
import { AuthTokenModule } from './auth-token.module';
import {
  RabbitMqService,
  RabbitMqServiceImpl,
} from 'libs/common/rabbit-mq/rabbit-mq.service';
import { AUTH_TOKEN_SERVICE } from './constants/service';

async function bootstrap() {
  const app = await NestFactory.create(AuthTokenModule);
  const rabbitMQService = app.get<RabbitMqService>(RabbitMqServiceImpl);
  app.connectMicroservice(
    rabbitMQService.geOptions({ queue_name: AUTH_TOKEN_SERVICE }),
  );
  app.startAllMicroservices();
  await app.listen(9090);
}

bootstrap();
