import * as Joi from 'joi';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CFPFieldEntity } from './cfpField.entity';

@Entity({
  name: 'cfps_fields_options',
  orderBy: {
    order: 'ASC',
  },
})
export class CFPFieldOptionEntity {
  static validationSchema = Joi.object({
    value: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    order: Joi.number().required(),
  });

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'integer' })
  order: number;

  @ManyToOne(() => CFPFieldEntity, (field) => field.options, {
    onDelete: 'CASCADE',
  })
  field: CFPFieldEntity;
}
