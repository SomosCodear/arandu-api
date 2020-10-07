import { Controller, Get, Param, Patch, Body, UsePipes } from '@nestjs/common';
import { CFP } from './cfp.service';
import { CFPFieldDTO } from './cfpField.dto';
import { ValidationPipe } from '../commons/validation.pipe';
import { CFPFieldEntity } from './cfpField.entity';

@Controller('cfps')
export class CFPController {
  constructor(private cfp: CFP) {}
  @Get(':slug')
  getCFPById(@Param('slug') slug: string) {
    return this.cfp.getBySlug(slug);
  }
  @Patch(':slug/field/:fieldId')
  @UsePipes(new ValidationPipe(CFPFieldEntity.updateValidationSchema))
  async updateField(
    @Body() fieldData: Partial<CFPFieldDTO>,
    @Param('slug') slug: string,
    @Param('fieldId') fieldId: string,
  ) {
    /**
     * @todo validate that the field is owned by the CFP.
     */
    await this.cfp.getBySlug(slug);
    return this.cfp.updateField(fieldId, fieldData);
  }
}
