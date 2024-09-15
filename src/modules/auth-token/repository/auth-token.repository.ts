import {
  BaseCRUDRepository,
  BaseCRUDRepositoryImpl,
} from 'src/shared/respository/base.repository';
import {
  AuthTokenSchemaClass,
  AuthTokenSchemaDocument,
} from '../entities/auth-token.entity';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
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
