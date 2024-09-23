import { Inject, Provider } from '@nestjs/common';
import { RabbitMqServiceImpl } from '../rabbit-mq.service';

const PROVIDER = 'RABBIT_MQ_SERVICE';

export const RabbitMqServiceProvider: Provider = {
  provide: PROVIDER,
  useClass: RabbitMqServiceImpl,
};

export const RabbitMqServiceInject = () => Inject(PROVIDER);
