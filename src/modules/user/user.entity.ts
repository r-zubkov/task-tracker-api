import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';

export enum UserType {
  user = 'user',
  admin = 'admin'
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({name: 'is_active', default: true })
  isActive: boolean;

  @Column({length: 32, nullable: false})
  email: string;

  @Column({length: 20, nullable: false})
  password: string;

  @Column({name: 'password_hash', length: 20, nullable: true})
  passwordHash: string;

  @Column('enum', {enum: [UserType.user, UserType.admin], default: UserType.user})
  type: UserType;

  @Column({name: 'first_name', length: 30, nullable: false})
  firstName: string;

  @Column({name: 'middle_name', length: 30, nullable: true})
  middleName: string;

  @Column({name: 'last_name', length: 30, nullable: false})
  lastName: string;

  @Column('date', {name: 'birth_date', nullable: false})
  birthDate: Date;

  @Column({length: 15, nullable: false})
  number: string;

  @Column({length: 500, nullable: true})
  description: string;

  @OneToMany(() => Project, project => project.owner)
  projects: Project[];
}
