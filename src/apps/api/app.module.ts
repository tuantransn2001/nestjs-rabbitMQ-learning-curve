import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ENVConfig } from '../../config/configuration';
import { PackageModule } from 'src/modules/packages.module';

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
