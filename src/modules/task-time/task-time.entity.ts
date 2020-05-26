import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class TaskTime {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('datetime', {nullable: false})
  date: Date;

  @Column({name: 'time_spent', nullable: false})
  timeSpent: number;

  @Column({name: 'change_reason', length: 150, nullable: true})
  changeReason: string;

  @ManyToOne(() => User, user => user.taskAuthorTrackedTime, {nullable: false})
  author: User;

  @ManyToOne(() => Task, task => task.taskTrackedTime, {nullable: false})
  task: Task;

  @Column('datetime', {name: 'updated_at', nullable: true})
  updatedAt: Date;

  @Column('datetime', {name: 'created_at', nullable: false})
  createdAt: Date;
}
