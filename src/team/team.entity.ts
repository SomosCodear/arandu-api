import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CFPEntity } from 'src/cfp/cfp.entity';

@Entity({
  name: 'teams',
})
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'text', default: '' })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CFPEntity, (cfp) => cfp.team)
  cfps: CFPEntity[];
}
