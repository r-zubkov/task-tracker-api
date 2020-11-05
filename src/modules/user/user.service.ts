import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

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
    return await this.usersRepository.insert(user)
  }

  async update(user: UpdateUserDto, userUuid: string): Promise<UpdateResult> {
    return await this.usersRepository.update(userUuid, user)
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
      where: { isActive: true },
      relations: ['projectParticipants']
    });
  }

  async findByEmail({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email, isActive: true }
    });
    const errMessage = 'Invalid password or email';

    if (!user) {
      throw new HttpException(errMessage, HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await this.comparePasswords(user.password, password);
    if (!areEqual) {
      throw new HttpException(errMessage, HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findByPayload({ email }: any): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email: email, isActive: true }
    });
  }

  async comparePasswords(userPassword, currentPassword): Promise<boolean> {
    return await bcrypt.compare(currentPassword, userPassword);
  };
}
