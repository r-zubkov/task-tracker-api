import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { ProjectParticipant } from '../participant/project-participant.entity';

@Entity()
export class Project {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'is_active', default: true })
  isActive: boolean;

  @Column({length: 50, nullable: false})
  name: string;

  @Column({length: 500, nullable: true})
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => User, user => user.projectOwner, {nullable: false})
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => ProjectParticipant, projectParticipant => projectParticipant.project)
  projectParticipants: ProjectParticipant[];

  @OneToMany(() => Task, task => task.project, {nullable: false})
  tasks: Task[];
}
