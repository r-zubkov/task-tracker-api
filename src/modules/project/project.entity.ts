import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Project {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({name: 'is_active', default: true })
  isActive: boolean;

  @Column({length: 50, nullable: false})
  name: string;

  @Column({length: 500, nullable: true})
  description: string;

  @ManyToOne(() => User, user => user.projectOwner, {nullable: false})
  owner: User;

  @ManyToMany(() => User, user => user.projectParticipant, {cascade: true})
  participants: User[];
}
