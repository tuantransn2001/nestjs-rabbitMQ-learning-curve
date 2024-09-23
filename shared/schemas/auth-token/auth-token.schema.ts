import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseCollection } from 'shared/common/utils/database/database-collection';
import { BaseSchema } from 'shared/schemas/base/base.schema';

@Schema({
  collection: DatabaseCollection.COLLECTION_AUTH_TOKEN,
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AuthTokenSchemaClass extends BaseSchema {
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
