import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { Task } from '../task/task.entity';
import { TaskComment } from '../task-comment/task-comment.entity';
import { TaskTime } from '../task-time/task-time.entity';
import { ProjectParticipant } from '../participant/project-participant.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  user = 'user',
  admin = 'admin'
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'is_active', default: true })
  isActive: boolean;

  @Column({length: 32, unique: true, nullable: false})
  email: string;

  @Column({length: 100, nullable: false})
  @Exclude()
  password: string;

  @Column('enum', {enum: [UserRole.user, UserRole.admin], default: UserRole.user})
  role: UserRole;

  @Column({name: 'first_name', length: 30, nullable: false})
  firstName: string;

  @Column({name: 'middle_name', length: 30, nullable: true})
  middleName: string;

  @Column({name: 'last_name', length: 30, nullable: false})
  lastName: string;

  @Column('date', {name: 'birth_date', nullable: true})
  birthDate: Date;

  @Column({length: 15, nullable: true})
  number: string;

  @Column({length: 500, nullable: true})
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => Project, projectOwner => projectOwner.owner)
  projectOwner: Project[];

  @OneToMany(() => ProjectParticipant, projectParticipant => projectParticipant.user)
  projectParticipants: ProjectParticipant[];

  @OneToMany(() => Task, taskAuthor => taskAuthor.author)
  taskAuthor: Task[];

  @OneToMany(() => TaskTime, taskTime => taskTime.author)
  taskAuthorTrackedTime: TaskTime[];

  @OneToMany(() => Task, taskExecutor => taskExecutor.author)
  taskExecutor: Task[];

  @OneToMany(() => TaskComment, commentAuthor => commentAuthor.author)
  commentAuthor: TaskComment[];

  get isAdmin(): boolean {
    return this.role === UserRole.admin;
  }
}
