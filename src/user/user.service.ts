import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(id: string): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: User): Promise<InsertResult> {
    return await this.usersRepository.insert({
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      number: user.number
    })
  }

  async update(user: User): Promise<UpdateResult> {
    return await this.usersRepository.update(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      number: user.number
    })
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id)
  }
}
