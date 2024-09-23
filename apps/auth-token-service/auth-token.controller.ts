import { Controller } from '@nestjs/common';
import { AuthTokenServiceInject } from './persistence/auth-token.service';
import { AuthTokenService } from './auth-token.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AUTH_TOKEN_EVENT } from './constants/event';
import { AuthTokenSchemaClass } from 'shared/schemas/auth-token/auth-token.schema';
import { RabbitMqServiceInject } from 'libs/common/rabbit-mq/persistence/rabbit-mq.service';
import { RabbitMqService } from 'libs/common/rabbit-mq/rabbit-mq.service';

@Controller('auth-token')
export class AuthTokenController {
  constructor(
    @AuthTokenServiceInject()
    private readonly authTokenService: AuthTokenService,
    @RabbitMqServiceInject()
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  @MessagePattern(AUTH_TOKEN_EVENT.CHECK_EXIST)
  async checkExistToken(@Payload() token: string, @Ctx() context: RmqContext) {
    try {
      const response = await this.authTokenService.checkExistToken(token);
      console.log('Check Exist Token', response);
      return response;
    } catch (error) {
      console.error('Error in checkExistToken', error);
      throw error;
    } finally {
      this.rabbitMqService.ack(context);
    }
  }

  @EventPattern(AUTH_TOKEN_EVENT.CREATE)
  async createAuthToken(
    @Payload() data: AuthTokenSchemaClass,
    @Ctx() context: RmqContext,
  ) {
    try {
      const response = await this.authTokenService.createAuthToken(data);
      console.log('Create Auth Token', response);
      return response;
    } catch (error) {
      console.error('Error in createAuthToken', error);
      throw error;
    } finally {
      this.rabbitMqService.ack(context);
    }
  }

  @EventPattern(AUTH_TOKEN_EVENT.DELETE)
  async deleteAuthToken(@Payload() token: string, @Ctx() context: RmqContext) {
    try {
      const response = await this.authTokenService.deleteAuthToken({
        token,
      });
      console.log('Delete Auth Token', response);

      return response;
    } catch (error) {
      console.error('Error in deleteAuthToken', error);
      throw error;
    } finally {
      this.rabbitMqService.ack(context);
    }
  }
}
