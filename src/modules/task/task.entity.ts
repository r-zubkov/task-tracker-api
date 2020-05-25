import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { TaskComment } from '../task-comment/task-comment.entity';
import { TaskTime } from '../task-time/task-time.entity';

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

  @Column({name: 'estimated_time', nullable: false})
  estimatedTime: number;

  @Column({length: 5000, nullable: true})
  description: string;

  @ManyToOne(() => User, user => user.taskExecutor, {nullable: false})
  executor: User;

  @ManyToOne(() => User, user => user.taskChecker, {nullable: false})
  checker: User;

  @ManyToOne(() => User, user => user.taskAuthor, {nullable: false})
  author: User;

  @OneToMany(() => TaskComment, taskComment => taskComment.task)
  taskComments: TaskComment[];

  @OneToMany(() => TaskTime, taskTime => taskTime.task)
  taskTrackedTime: TaskTime[];

  @Column('datetime', {name: 'date_End', nullable: false})
  DateEnd: Date;

  @Column('datetime', {name: 'executed_at', nullable: true})
  executedAt: Date;

  @Column('datetime', {name: 'created_at', nullable: false})
  createdAt: Date;
}
