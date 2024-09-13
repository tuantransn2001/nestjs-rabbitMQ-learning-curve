import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';

@Module({
  imports: [UserModule, AuthModule, CacheManagerModule],
})
export class PackageModule {}
