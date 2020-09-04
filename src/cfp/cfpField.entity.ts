import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CFPEntity } from './cfp.entity';
import { CFPFieldOptionEntity } from './cfpFieldOption.entity';

@Entity({
  name: 'cfps_fields',
  orderBy: {
    order: 'ASC',
  },
})
export class CFPFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  type: string;

  @Column()
  name: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  value: string;

  @Column({ type: 'text', default: '' })
  hint: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'integer' })
  order: number;

  @ManyToOne(() => CFPEntity, (cfp) => cfp.fields, { onDelete: 'CASCADE' })
  cfp: CFPEntity;

  @OneToMany(() => CFPFieldOptionEntity, (option) => option.field)
  options: CFPFieldOptionEntity[];
}
