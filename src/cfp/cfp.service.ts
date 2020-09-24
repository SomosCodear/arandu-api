import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { Repository } from 'typeorm';
import { CFPFieldDTO } from './cfpField.dto';
import { CFPFieldEntity } from './cfpField.entity';

@Injectable()
export class CFP {
  constructor(
    @InjectRepository(CFPEntity) private cfpRepository: Repository<CFPEntity>,
    @InjectRepository(CFPFieldEntity)
    private cfpFieldRepository: Repository<CFPFieldEntity>,
  ) {}
  async getBySlug(slug: string, failWithError = true): Promise<CFPEntity> {
    const result = await this.cfpRepository.findOne({
      where: { slug },
      relations: ['fields', 'fields.options'],
    });

    if (!result && failWithError) {
      throw new HttpException('CFP not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
  async updateField(
    fieldId: string,
    data: Partial<CFPFieldDTO>,
    failWithError = true,
  ): Promise<CFPFieldEntity> {
    const field = await this.cfpFieldRepository.findOne({ id: fieldId });
    if (!field && failWithError) {
      throw new HttpException('Field not found', HttpStatus.NOT_FOUND);
    }

    return this.cfpFieldRepository.save({
      ...field,
      ...data,
    });
  }
}
