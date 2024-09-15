import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import { UserServiceProvider } from './persistence/user.service';
import { UserRepositoryProvider } from './persistence/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { CacheManagerProvider } from '../cache-manager/persistence/cache-manager.service';
import { AuthTokenRepositoryProvider } from '../auth-token/persistence/auth-token.repository';
import { AuthTokenSchema } from '../auth-token/entities/auth-token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollection.COLLECTION_USER,
        schema: UserSchema,
      },
      {
        name: DatabaseCollection.COLLECTION_AUTH_TOKEN,
        schema: AuthTokenSchema,
      },
    ]),
  ],
  providers: [
    UserServiceProvider,
    UserRepositoryProvider,
    JwtService,
    CacheManagerProvider,
    AuthTokenRepositoryProvider,
  ],
  controllers: [UserController],
})
export class UserModule {}
