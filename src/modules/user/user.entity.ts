import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserType {
  user = 'user',
  admin = 'admin'
}

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({length: 32, nullable: false})
  email: string;

  @Column({length: 20, nullable: false})
  password: string;

  @Column({name: 'password_hash', length: 20, nullable: true})
  passwordHash: string;

  @Column('enum', {enum: [UserType.user, UserType.admin], default: UserType.user})
  type: UserType;

  @Column({name: 'is_active', default: true })
  isActive: boolean;

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
}
