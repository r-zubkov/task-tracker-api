import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class TaskTime {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('datetime', {nullable: false})
  date: Date;

  @ManyToOne(() => User, user => user.taskAuthorTrackedTime, {nullable: false})
  author: User;

  @ManyToOne(() => Task, task => task.taskTrackedTime, {nullable: false})
  task: Task;
}
