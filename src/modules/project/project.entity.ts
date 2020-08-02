import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';

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

  @Column('datetime', {name: 'updated_at', nullable: true})
  updatedAt: string;

  @Column('datetime', {name: 'created_at', nullable: false})
  createdAt: string;

  @ManyToOne(() => User, user => user.projectOwner, {nullable: false})
  owner: User;

  @ManyToMany(() => User, user => user.projectParticipant, {cascade: true})
  participants: User[];

  @OneToMany(() => Task, task => task.project, {nullable: false})
  tasks: Task[];
}
