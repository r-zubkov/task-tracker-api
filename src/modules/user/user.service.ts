import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: id,
        isActive: true
      },
      relations: ['projectOwner', 'projectParticipant'],
    });
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find({
      where: {isActive: true}
    });
  }

  async create(user: User): Promise<InsertResult> {
    return await this.usersRepository.insert({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      number: user.number,
      description: user.description
    })
  }

  async update(user: User): Promise<UpdateResult> {
    return await this.usersRepository.update(user.id, {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      number: user.number,
      description: user.description
    })
  }

  async block(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({where: {id: id, isActive: true}});
    user.isActive = false;

    return await this.usersRepository.save(user)
  }

  async unblock(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({where: {id: id, isActive: false}});
    user.isActive = true;

    return await this.usersRepository.save(user)
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    return await this.usersRepository.findByIds(ids, {relations: ['projectParticipant']});
  }

  async updateParticipantsState(participants: User[]): Promise<User[]> {
    return await this.usersRepository.save(participants);
  }
}
