import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { DateHelper } from '../../common/helpers/date.helper';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: id
      },
      relations: ['projectOwner', 'projectParticipant'],
    });
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: CreateUserDto): Promise<InsertResult> {
    return await this.usersRepository.insert({
      ...user,
      createdAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async update(user: UpdateUserDto, userId: string): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, {
      ...user,
      updatedAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async block(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
        isActive: true
      }
    });
    user.isActive = false;

    return await this.usersRepository.save(user)
  }

  async unblock(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
        isActive: false
      }
    });
    user.isActive = true;

    return await this.usersRepository.save(user)
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    return await this.usersRepository.findByIds(ids, {
        relations: ['projectParticipant']
      });
  }

  async updateParticipantsState(participants: User[]): Promise<User[]> {
    return await this.usersRepository.save(participants);
  }
}
