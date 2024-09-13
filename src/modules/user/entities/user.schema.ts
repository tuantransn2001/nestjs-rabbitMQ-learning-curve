import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import { BaseEntity } from 'src/shared/entity/base.entity';

@Schema({
  collection: DatabaseCollection.COLLECTION_USER,
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends BaseEntity {
  public static toDto(user: UserSchemaClass) {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public static generateId() {
    return new mongoose.Types.ObjectId();
  }

  @Prop({
    type: mongoose.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: String,
  })
  firstName: string;

  @Prop({
    type: String,
  })
  lastName: string;
}

export type UserSchemaDocument = UserSchemaClass & Document<any, any, any>;
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
