import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { DateHelper } from '../../shared/helpers/date.helper';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(uuid: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: uuid
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

  async update(user: UpdateUserDto, userUuid: string): Promise<UpdateResult> {
    return await this.usersRepository.update(userUuid, {
      ...user,
      updatedAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async block(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: uuid,
        isActive: true
      }
    });
    user.isActive = false;

    return await this.usersRepository.save(user)
  }

  async unblock(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: uuid,
        isActive: false
      }
    });
    user.isActive = true;

    return await this.usersRepository.save(user)
  }

  async findUsersByIds(uuids: string[]): Promise<User[]> {
    return await this.usersRepository.findByIds(uuids, {
        relations: ['projectParticipant']
      });
  }

  async updateParticipantsState(participants: User[]): Promise<User[]> {
    return await this.usersRepository.save(participants);
  }
}
