import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class TaskComment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({length: 1000, nullable: false})
  text: string;

  @ManyToOne(() => User, user => user.taskAuthor, {nullable: false})
  author: User;

  @ManyToOne(() => Task, task => task.taskComments, {nullable: false})
  task: Task;

  @Column('datetime', {name: 'created_at', nullable: false})
  createdAt: Date;
}
