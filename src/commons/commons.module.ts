import { Module } from '@nestjs/common';
import { Utils } from './utils.service';

@Module({
  providers: [Utils],
})
export class CommonsModule {}
