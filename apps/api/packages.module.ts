import { Module } from '@nestjs/common';
import { UserModule } from '../user-service/user.module';
import { AuthModule } from '../auth-service/auth.module';
import { CacheManagerModule } from 'libs/common/cache-manager/cache-manager.module';

@Module({
  imports: [UserModule, AuthModule, CacheManagerModule],
})
export class PackageModule {}
