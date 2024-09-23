import {
  BaseCRUDRepository,
  BaseCRUDRepositoryImpl,
} from 'shared/respositories/base/base.repository';
import {
  UserSchemaClass,
  UserSchemaDocument,
} from '../../schemas/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseCollection } from 'shared/common/utils/database/database-collection';
import { Model } from 'mongoose';

export interface UserRepository extends BaseCRUDRepository<UserSchemaClass> {
  findByEmail(email: string): Promise<UserSchemaDocument>;
}

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

  public async findByEmail(email: string): Promise<UserSchemaDocument> {
    return this.userModel.findOne({ email });
  }
}
