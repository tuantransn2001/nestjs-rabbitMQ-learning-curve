import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

export interface RabbitMqService {
  geOptions({
    queue_name,
    noAck,
  }: {
    queue_name: string;
    noAck?: boolean;
  }): RmqOptions;
  ack(context: RmqContext): void;
}

@Injectable()
export class RabbitMqServiceImpl implements RabbitMqService {
  constructor(private readonly configService: ConfigService) {}

  public geOptions({
    queue_name,
    noAck = false,
  }: {
    queue_name: string;
    noAck?: boolean;
  }): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('rabbitMq.connection_string')],
        queue: this.configService.get<string>(`rabbitMq.names.${queue_name}`),
        noAck: noAck,
        persistent: true,
      },
    };
  }

  public ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}