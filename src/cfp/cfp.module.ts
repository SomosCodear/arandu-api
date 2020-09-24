import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { CFP } from './cfp.service';
import { CFPController } from './cfp.controller';
import { CFPFieldEntity } from './cfpField.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CFPEntity, CFPFieldEntity])],
  providers: [CFP],
  controllers: [CFPController],
})
export class CFPModule {}
