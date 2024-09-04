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

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollection.COLLECTION_USER,
        schema: UserSchema,
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
  ],
})
export class AuthModule {}
