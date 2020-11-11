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
import { TaskComment } from '../task-comment/task-comment.entity';
import { TaskTime } from '../task-time/task-time.entity';
import { Project } from '../project/project.entity';

export enum PriorityType {
  low = 'low',
  regular = 'regular',
  high = 'high'
}

export enum TaskStatusType {
  new = 'new',
  inWork = 'in_work',
  delayed = 'delayed',
  rejected = 'rejected',
  completed = 'completed',
  returned = 'returned'
}

@Entity()
export class Task {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({length: 50, nullable: false})
  name: string;

  @Column('enum', {enum: [PriorityType.low, PriorityType.regular, PriorityType.high]})
  priority: PriorityType;

  @Column('enum', {enum: [
    TaskStatusType.new,
    TaskStatusType.inWork,
    TaskStatusType.delayed,
    TaskStatusType.rejected,
    TaskStatusType.completed,
    TaskStatusType.returned,
  ], default: TaskStatusType.new})
  status: TaskStatusType;

  @Column({length: 5000, nullable: true})
  description: string;

  @Column('datetime', {name: 'time_start', nullable: true})
  timeStart: Date;

  @Column('datetime', {name: 'time_end', nullable: true})
  timeEnd: Date;

  @Column('datetime', {nullable: true})
  started: Date;

  @Column('datetime', {nullable: true})
  executed: Date;

  @CreateDateColumn()
  created: string;

  @UpdateDateColumn()
  updated: string;

  @ManyToOne(() => Project, project => project.tasks, {nullable: false})
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.taskExecutor, {nullable: false})
  @JoinColumn({ name: 'executor_id' })
  executor: User;

  @ManyToOne(() => User, user => user.taskAuthor, {nullable: false})
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => TaskComment, taskComment => taskComment.task)
  taskComments: TaskComment[];

  @OneToMany(() => TaskTime, taskTime => taskTime.task)
  taskTrackedTime: TaskTime[];
}
