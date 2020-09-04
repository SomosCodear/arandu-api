import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { TeamEntity } from 'src/team/team.entity';
import { CFPFieldEntity } from './cfpField.entity';

@Entity({
  name: 'cfps',
})
@Unique(['team', 'slug'])
export class CFPEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => TeamEntity, (team) => team.cfps, { onDelete: 'CASCADE' })
  team: TeamEntity;

  @OneToMany(() => CFPFieldEntity, (field) => field.cfp)
  fields: CFPFieldEntity[];
}
