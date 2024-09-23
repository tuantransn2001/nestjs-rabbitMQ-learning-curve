import { Prop } from '@nestjs/mongoose';
import { now } from 'mongoose';
export class BaseSchema {
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({
    default: null,
  })
  deletedAt?: Date | null;
}
