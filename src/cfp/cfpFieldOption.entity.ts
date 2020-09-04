import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CFPFieldEntity } from './cfpField.entity';

@Entity({
  name: 'cfps_fields_options',
  orderBy: {
    order: 'ASC',
  },
})
export class CFPFieldOptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'numeric' })
  order: number;

  @ManyToOne(() => CFPFieldEntity, (field) => field.options, {
    onDelete: 'CASCADE',
  })
  field: CFPFieldEntity;
}
