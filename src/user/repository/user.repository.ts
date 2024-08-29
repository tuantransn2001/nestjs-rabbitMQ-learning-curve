import {
  BaseCRUDRepository,
  BaseCRUDRepositoryImpl,
} from 'src/shared/respository/base.repository';
import { UserSchemaClass, UserSchemaDocument } from '../entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import { Model } from 'mongoose';

export interface UserRepository extends BaseCRUDRepository<UserSchemaClass> {}

export class UserRepositoryImpl
  extends BaseCRUDRepositoryImpl<UserSchemaDocument>
  implements UserRepository
{
  constructor(
    @InjectModel(DatabaseCollection.COLLECTION_USER)
    private readonly userModel: Model<UserSchemaDocument>,
  ) {
    super(userModel);
  }
}
