import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import { BaseEntity } from 'src/shared/entity/base.entity';

@Schema({
  collection: DatabaseCollection.COLLECTION_AUTH_TOKEN,
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AuthTokenSchemaClass extends BaseEntity {
  public static generateId() {
    return new mongoose.Types.ObjectId();
  }

  @Prop({
    type: mongoose.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: DatabaseCollection.COLLECTION_USER,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
  })
  token: string;
}

export type AuthTokenSchemaDocument = AuthTokenSchemaClass &
  mongoose.Document<any, any, any>;
export const AuthTokenSchema =
  SchemaFactory.createForClass(AuthTokenSchemaClass);
