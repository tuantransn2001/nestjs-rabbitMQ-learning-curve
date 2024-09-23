import { Module } from '@nestjs/common';
import { DatabaseModule } from 'libs/common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ENVConfig } from 'shared/config/configuration';
import { PackageModule } from 'apps/api/packages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENVConfig],
    }),
    DatabaseModule,
    PackageModule,
  ],
  providers: [],
})
export class AppModule {}
