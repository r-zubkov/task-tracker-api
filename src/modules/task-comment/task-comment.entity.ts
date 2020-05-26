import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

@Entity()
export class TaskComment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({length: 1000, nullable: false})
  text: string;

  @Column({name: 'change_reason', length: 150, nullable: true})
  changeReason: string;

  @ManyToOne(() => User, user => user.taskAuthor, {nullable: false})
  author: User;

  @ManyToOne(() => Task, task => task.taskComments, {nullable: false})
  task: Task;

  @Column('datetime', {name: 'updated_at', nullable: true})
  updatedAt: Date;

  @Column('datetime', {name: 'created_at', nullable: false})
  createdAt: Date;
}
