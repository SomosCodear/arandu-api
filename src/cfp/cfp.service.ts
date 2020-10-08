import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { Not, Repository } from 'typeorm';
import { CFPFieldDTO } from './cfpField.dto';
import { CFPFieldEntity } from './cfpField.entity';

@Injectable()
export class CFP {
  constructor(
    @InjectRepository(CFPEntity) private cfpRepository: Repository<CFPEntity>,
    @InjectRepository(CFPFieldEntity)
    private cfpFieldRepository: Repository<CFPFieldEntity>,
  ) {}
  async getBySlug(
    slug: string,
    failWithError = true,
    includeRelations = true,
  ): Promise<CFPEntity> {
    const result = await this.cfpRepository.findOne({
      where: { slug },
      relations: includeRelations ? ['fields', 'fields.options'] : [],
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
    const field = await this.cfpFieldRepository.findOne({
      where: { id: fieldId },
      relations: ['cfp'],
    });
    if (!field && failWithError) {
      throw new HttpException('Field not found', HttpStatus.NOT_FOUND);
    }

    const updateOrder = data.order && data.order !== field.order;
    console.log('UPDATE ORDER', updateOrder, data.order, field.order);
    const updated = await this.cfpFieldRepository.save({
      ...field,
      ...data,
    });

    if (updateOrder) {
      console.log('RUNNING UPDTE');
      await this.updateFieldOrder(updated);
    }

    return updated;
  }
  async createField(data: Required<CFPFieldDTO>): Promise<CFPFieldEntity> {
    const field = await this.cfpFieldRepository.save(data);
    await this.updateFieldOrder(field);
    return field;
  }

  async updateFieldOrder(field: CFPFieldEntity): Promise<void> {
    const fields = await this.cfpFieldRepository.find({
      where: {
        cfp: field.cfp,
        id: Not(field.id),
      },
      order: {
        order: 'ASC',
      },
    });

    let increment = 0;
    await Promise.all(
      fields.reduce(
        (
          acc: Promise<CFPFieldEntity>[],
          item: CFPFieldEntity,
          index: number,
        ): Promise<CFPFieldEntity>[] => {
          if (!index && item.order !== 1) {
            increment = -1;
          } else if (index + 1 === field.order) {
            increment = 1;
          }

          if (increment) {
            item.order += increment;
            return [...acc, this.cfpFieldRepository.save(item)];
          }

          return acc;
        },
        [],
      ),
    );
  }
}
