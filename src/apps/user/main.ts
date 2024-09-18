import { NestFactory } from '@nestjs/core';
import { USER_SERVICE } from 'src/modules/user/constants/service';
import { UserModule } from 'src/modules/user/user.module';
import {
  RabbitMqService,
  RabbitMqServiceImpl,
} from 'src/rabbit-mq/rabbit-mq.service';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rabbitMQService = app.get<RabbitMqService>(RabbitMqServiceImpl);
  app.connectMicroservice(
    rabbitMQService.geOptions({ queue_name: USER_SERVICE }),
  );
  await app.listen(3000);
}

bootstrap();
