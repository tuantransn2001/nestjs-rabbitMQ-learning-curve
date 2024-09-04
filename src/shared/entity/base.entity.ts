import { Prop } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { Document } from 'mongoose';
export class BaseEntity extends Document {
  constructor(baseEntity: Partial<BaseEntity> = {}) {
    super();
    this.createdAt = baseEntity?.createdAt;
    this.updatedAt = baseEntity?.updatedAt;
    this.deletedAt = baseEntity?.deletedAt;
  }

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({
    default: null,
  })
  deletedAt?: Date | null;
}
