import { Module } from '@nestjs/common';
import { mongooseProvider } from './database.provider';

@Module({
  providers: [...mongooseProvider],
  exports: [...mongooseProvider],
})
export class DatabaseModule {}
