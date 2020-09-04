import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { CFP } from './cfp.service';
import { CFPController } from './cfp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CFPEntity])],
  providers: [CFP],
  controllers: [CFPController],
})
export class CFPModule {}
