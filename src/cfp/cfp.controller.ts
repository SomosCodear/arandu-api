import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UsePipes,
  Post,
  Delete,
} from '@nestjs/common';
import { CFP } from './cfp.service';
import { CFPFieldDTO } from './cfpField.dto';
import { ValidationPipe } from '../commons/validation.pipe';
import { CFPFieldEntity } from './cfpField.entity';
import { CFPFieldOptionDTO } from './cfpFieldOption.dto';
import * as Joi from 'joi';
import { CFPFieldOptionEntity } from './cfpFieldOption.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('cfps')
export class CFPController {
  constructor(private cfp: CFP) {}
  @Get(':slug')
  getCFPById(@Param('slug') slug: string) {
    return this.cfp.getBySlug(slug);
  }
  @Post(':slug/field')
  @UsePipes(
    new ValidationPipe(
      Joi.object({
        field: CFPFieldEntity.creationValidationSchema.required(),
        options: Joi.array().items(CFPFieldOptionEntity.validationSchema),
      }),
    ),
  )
  async createField(
    @Body()
    fieldData: {
      field: CFPFieldDTO;
      options?: CFPFieldOptionDTO[];
    },
    @Param('slug') slug: string,
  ) {
    const cfp = await this.cfp.getBySlug(slug, true, false);
    let field = await this.cfp.createField({
      ...fieldData.field,
      cfp,
    });
    if (fieldData.options && fieldData.options.length) {
      await this.cfp.setOptionsForField(field, fieldData.options);
      field = await this.cfp.getFieldById(field.id);
    }

    return field;
  }

  @Patch(':slug/field/:fieldId')
  @UsePipes(
    new ValidationPipe(
      Joi.object({
        field: CFPFieldEntity.updateValidationSchema.required(),
        options: Joi.array().items(CFPFieldOptionEntity.validationSchema),
      }),
    ),
  )
  async updateField(
    @Body()
    fieldData: {
      field: Partial<CFPFieldDTO>;
      options?: CFPFieldOptionDTO[];
    },
    @Param('slug') slug: string,
    @Param('fieldId') fieldId: string,
  ) {
    /**
     * @todo validate that the field is owned by the CFP.
     */
    await this.cfp.getBySlug(slug);
    let field = await this.cfp.updateField(fieldId, fieldData.field);
    if (fieldData.options && fieldData.options.length) {
      await this.cfp.setOptionsForField(field, fieldData.options);
      field = await this.cfp.getFieldById(field.id);
    }
    return field;
  }

  @Delete(':slug/field/:fieldId')
  async deleteField(
    @Param('slug') slug: string,
    @Param('fieldId') fieldId: string,
  ) {
    await this.cfp.getBySlug(slug);
    return this.cfp.deleteField(fieldId);
  }
}
