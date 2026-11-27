import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Entity()
export class ProjectParticipant {

  @Column({name: 'is_active', default: true })
  isActive: boolean;

  @PrimaryColumn('uuid', { name: 'user_id', length: 36 })
  @Exclude({ toPlainOnly: true })
  userId: string;

  @PrimaryColumn('uuid', { name: 'project_id', length: 36 })
  @Exclude({ toPlainOnly: true })
  projectId: string;

  @ManyToOne(() => User, user => user.projectParticipants, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Project, project => project.projectParticipants, { nullable: false })
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
