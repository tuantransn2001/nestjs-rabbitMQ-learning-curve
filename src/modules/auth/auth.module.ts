import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServiceProvider } from './persistence/auth.service';
import { LocalStrategy } from './local.strategy';
import { UserRepositoryProvider } from '../user/persistence/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/entities/user.schema';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthTokenRepositoryProvider } from '../auth-token/persistence/auth-token.repository';
import { AuthTokenSchema } from '../auth-token/entities/auth-token.entity';
import { UserServiceProvider } from '../user/persistence/user.service';
import { CacheManagerProvider } from '../cache-manager/persistence/cache-manager.service';

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
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthServiceProvider,
    UserRepositoryProvider,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    AuthTokenRepositoryProvider,
    UserServiceProvider,
    CacheManagerProvider,
  ],
})
export class AuthModule {}
