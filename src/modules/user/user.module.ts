import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { DatabaseCollection } from 'src/common/utils/database/database-collection';
import { UserServiceProvider } from './persistence/user.service';
import { UserRepositoryProvider } from './persistence/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollection.COLLECTION_USER,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserServiceProvider, UserRepositoryProvider, JwtService],
  controllers: [UserController],
})
export class UserModule {}
