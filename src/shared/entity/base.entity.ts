import { Prop } from '@nestjs/mongoose';
import { now } from 'mongoose';
export class BaseEntity {
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({
    default: null,
  })
  deletedAt?: Date | null;
}
