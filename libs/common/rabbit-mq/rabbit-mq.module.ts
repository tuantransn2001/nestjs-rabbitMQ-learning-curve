import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMqServiceProvider } from './persistence/rabbit-mq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RabbitMqServiceProvider],
  exports: [RabbitMqServiceProvider],
})
export class RabbitMqModule {
  static register({ name }: { name: string }): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: name,
            useFactory: (configService: ConfigService) => {
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [
                    configService.get<string>('rabbitMq.connection_string'),
                  ],
                  queue: configService.get<string>(`rabbitMq.names.${name}`),
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
