import * as mongoose from 'mongoose';
import { Controller } from '@nestjs/common';
import { UserServiceInject } from './persistence/user.service';
import { UserService } from './user.service';
import { USER_EVENT } from './constants/event';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RabbitMqServiceInject } from 'libs/common/rabbit-mq/persistence/rabbit-mq.service';
import { RabbitMqService } from 'libs/common/rabbit-mq/rabbit-mq.service';
import { UserSchemaClass } from 'shared/schemas/user/user.schema';

@Controller('user')
export class UserController {
  constructor(
    @UserServiceInject()
    private readonly userService: UserService,
    @RabbitMqServiceInject()
    private readonly rabbitMqService: RabbitMqService,
  ) {}

  @MessagePattern(USER_EVENT.GET_ONE)
  async getOne(
    @Payload() filter: Partial<UserSchemaClass>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const response = await this.userService.getOne(filter);
      console.log('Get One', response);
      return response;
    } catch (error) {
      console.error('Error in getOne', error);
      throw error;
    } finally {
      this.rabbitMqService.ack(context);
    }
  }

  @MessagePattern(USER_EVENT.GET_PROFILE)
  async getProfile(
    @Payload() id: mongoose.Types.ObjectId,
    @Ctx() context: RmqContext,
  ) {
    try {
      const response = await this.userService.getProfile(id);
      console.log('Get Profile', response);
      return response;
    } catch (error) {
      console.error('Error in getProfile', error);
      throw error;
    } finally {
      this.rabbitMqService.ack(context);
    }
  }
}
