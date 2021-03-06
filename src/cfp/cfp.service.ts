import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CFPEntity } from './cfp.entity';
import { Not, Repository } from 'typeorm';
import { CFPFieldDTO } from './cfpField.dto';
import { CFPFieldEntity } from './cfpField.entity';
import { CFPFieldOptionDTO } from './cfpFieldOption.dto';
import { CFPFieldOptionEntity } from './cfpFieldOption.entity';
import { Utils } from '../commons/utils.service';

@Injectable()
export class CFP {
  constructor(
    @InjectRepository(CFPEntity) private cfpRepository: Repository<CFPEntity>,
    @InjectRepository(CFPFieldEntity)
    private cfpFieldRepository: Repository<CFPFieldEntity>,
    @InjectRepository(CFPFieldOptionEntity)
    private cfpFieldOptionRepository: Repository<CFPFieldOptionEntity>,
    private utils: Utils,
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

  async getFieldById(
    id: string,
    failWithError = true,
    includeRelations = true,
  ): Promise<CFPFieldEntity> {
    const result = await this.cfpFieldRepository.findOne({
      where: { id },
      relations: includeRelations ? ['cfp', 'options'] : [],
    });

    if (!result && failWithError) {
      throw new HttpException('Field not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
  async updateField(
    fieldId: string,
    data: Partial<CFPFieldDTO>,
    failWithError = true,
  ): Promise<CFPFieldEntity> {
    const field = await this.getFieldById(fieldId, failWithError);
    const updateOrder = data.order && data.order !== field.order;

    const updated = await this.cfpFieldRepository.save({
      ...field,
      ...data,
    });

    if (updateOrder) {
      await this.updateFieldOrder(updated);
    }

    return updated;
  }
  async createField(data: Required<CFPFieldDTO>): Promise<CFPFieldEntity> {
    const newField = await this.cfpFieldRepository.save(data);
    const field = await this.getFieldById(newField.id);
    await this.updateFieldOrder(field);
    return field;
  }
  async setOptionsForField(
    field: CFPFieldEntity,
    data: CFPFieldOptionDTO[],
  ): Promise<CFPFieldOptionEntity[]> {
    const useData = data.sort(this.utils.sortObjectsList('order'));
    const current = await this.cfpFieldOptionRepository.find({
      where: { field },
      order: {
        order: 'ASC',
      },
    });

    const options = await Promise.all(
      useData.reduce(
        (
          acc: Promise<CFPFieldOptionEntity>[],
          item: CFPFieldOptionDTO,
          index: number,
        ) => {
          const newOrder = index + 1;
          return [
            ...acc,
            this.cfpFieldOptionRepository.save({
              ...(current[index] || { field }),
              ...item,
              order: newOrder,
            }),
          ];
        },
        [],
      ),
    );
    const toDelete = current.slice(useData.length);
    if (toDelete.length) {
      await Promise.all(
        toDelete.map((item) => this.cfpFieldOptionRepository.delete(item)),
      );
    }

    return options;
  }

  async deleteField(fieldId: string): Promise<CFPFieldEntity> {
    const field = await this.cfpFieldRepository.findOne({
      where: { id: fieldId },
      relations: ['cfp'],
    });

    await this.updateFieldOrder(field, true);
    await this.cfpFieldOptionRepository.delete({
      field,
    });
    await this.cfpFieldRepository.delete(field);
    return field;
  }

  private async updateFieldOrder(
    field: CFPFieldEntity,
    deleting = false,
  ): Promise<void> {
    const fields = await this.cfpFieldRepository.find({
      where: {
        cfp: field.cfp,
        id: Not(field.id),
      },
      order: {
        order: 'ASC',
      },
    });

    if (!fields.length) {
      if (field.order !== 1) {
        field.order = 1;
        await this.cfpFieldRepository.save(field);
      }

      return;
    }
    const lastField = fields[fields.length - 1];
    if (lastField.order === fields.length) {
      const newLastOrder = lastField.order + 1;
      if (field.order === newLastOrder) return;
      if (field.order > newLastOrder) {
        field.order = newLastOrder;
        await this.cfpFieldRepository.save(field);
        return;
      }
    }

    let increment = 0;
    const incrementValue = deleting ? 0 : 1;
    await Promise.all(
      fields.reduce(
        (
          acc: Promise<CFPFieldEntity>[],
          item: CFPFieldEntity,
          index: number,
        ): Promise<CFPFieldEntity>[] => {
          let newOrder = index + 1;
          if (newOrder === field.order) {
            increment = incrementValue;
          }

          if (increment) {
            newOrder += increment;
          }

          if (item.order !== newOrder) {
            item.order = newOrder;
            return [...acc, this.cfpFieldRepository.save(item)];
          }

          return acc;
        },
        [],
      ),
    );
  }
}
