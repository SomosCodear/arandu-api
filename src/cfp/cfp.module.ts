import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { CFP } from './cfp.service';
import { CFPController } from './cfp.controller';
import { CFPFieldEntity } from './cfpField.entity';
import { CFPFieldOptionEntity } from './cfpFieldOption.entity';
import { CommonsModule } from '../commons/commons.module';
import { Utils } from '../commons/utils.service';

@Module({
  imports: [
    CommonsModule,
    TypeOrmModule.forFeature([CFPEntity, CFPFieldEntity, CFPFieldOptionEntity]),
  ],
  providers: [CFP, Utils],
  controllers: [CFPController],
})
export class CFPModule {}
