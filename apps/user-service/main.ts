import { NestFactory } from '@nestjs/core';
import { USER_SERVICE } from 'apps/user-service/constants/service';
import {
  RabbitMqService,
  RabbitMqServiceImpl,
} from 'libs/common/rabbit-mq/rabbit-mq.service';
import { UserModule } from './user.module';
import { AUTH_TOKEN_SERVICE } from 'apps/auth-token-service/constants/service';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rabbitMQService = app.get<RabbitMqService>(RabbitMqServiceImpl);
  app.connectMicroservice(
    rabbitMQService.geOptions({ queue_name: USER_SERVICE }),
  );
  app.connectMicroservice(
    rabbitMQService.geOptions({ queue_name: AUTH_TOKEN_SERVICE }),
  );
  app.startAllMicroservices();
  await app.listen(8080);
}

bootstrap();
