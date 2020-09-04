import { Module } from '@nestjs/common';
import { DBCommands } from './db.commands';

@Module({
  providers: [DBCommands],
})
export class DBModule {}
