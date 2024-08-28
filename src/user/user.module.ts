import { Module } from '@nestjs/common';
import { UserServiceProvider } from './persistence/user.service';

@Module({
  providers: [UserServiceProvider],
})
export class UserModule {}
