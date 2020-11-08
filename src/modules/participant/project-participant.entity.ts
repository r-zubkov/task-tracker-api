import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity()
export class ProjectParticipant {

  @Column({name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.projectParticipants, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, project => project.projectParticipants, { primary: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  get isActiveParticipant(): boolean {
    return this.isActive === true;
  }
}