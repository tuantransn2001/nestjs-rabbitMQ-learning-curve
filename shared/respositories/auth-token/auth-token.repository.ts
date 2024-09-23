import {
  BaseCRUDRepository,
  BaseCRUDRepositoryImpl,
} from 'shared/respositories/base/base.repository';
import {
  AuthTokenSchemaClass,
  AuthTokenSchemaDocument,
} from '../../schemas/auth-token/auth-token.schema';
import { DatabaseCollection } from 'shared/common/utils/database/database-collection';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface AuthTokenRepository
  extends BaseCRUDRepository<AuthTokenSchemaClass> {}

export class AuthTokenRepositoryImpl
  extends BaseCRUDRepositoryImpl<AuthTokenSchemaDocument>
  implements AuthTokenRepository
{
  constructor(
    @InjectModel(DatabaseCollection.COLLECTION_AUTH_TOKEN)
    private readonly authTokenModel: Model<AuthTokenSchemaDocument>,
  ) {
    super(authTokenModel);
  }
}
