import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { InsertResult, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { ApiEntityResponse, ApiListResponse } from '../../shared/helpers/api-response.helper';
import { CrudService } from '../../core/services/crud.service';

@Injectable()
export class UserService extends CrudService<User> {

  protected entityAlias = 'user';

  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository)
  }

  protected _buildQuery(user: User, uuid?: string): SelectQueryBuilder<User> {
    const query = this.repository.createQueryBuilder(this.entityAlias);

    if (uuid) {
      query.where(`${this.entityAlias}.id = :id`, { id: uuid });
    }

    // for non-admin, return only the active user
    if (!user.isAdmin) {
      query.andWhere(`${this.entityAlias}.isActive = :isActive`, { isActive: true })
    }

    if (uuid && user.isAdmin) {
      query
        .leftJoinAndSelect(`${this.entityAlias}.projectOwner`, 'projectOwner')
        .leftJoinAndSelect(`${this.entityAlias}.projectParticipants`, 'projectParticipant')
    }

    return query;
  }

  async getAll(user: User): Promise<ApiListResponse<User[]>> {
    return this.getEntityList(user);
  }

  async get(user: User, uuid: string): Promise<ApiEntityResponse<User> | HttpException> {
    return this.getEntity(user, uuid);
  }

  async create(user: CreateUserDto): Promise<InsertResult> {
    return await this.repository.insert(user)
  }

  async update(user: UpdateUserDto, userUuid: string): Promise<UpdateResult> {
    return await this.repository.update(userUuid, user)
  }

  async block(uuid: string): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        id: uuid,
        isActive: true
      }
    });
    user.isActive = false;

    return await this.repository.save(user)
  }

  async unblock(uuid: string): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        id: uuid,
        isActive: false
      }
    });
    user.isActive = true;

    return await this.repository.save(user)
  }

  async findUsersByIds(uuids: string[]): Promise<User[]> {
    return await this.repository.findByIds(uuids, {
      where: { isActive: true },
      relations: ['projectParticipants']
    });
  }

  async findByEmail({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.repository.findOne({
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
    return await this.repository.findOne({
      where: { email: email, isActive: true }
    });
  }

  async comparePasswords(userPassword, currentPassword): Promise<boolean> {
    return await bcrypt.compare(currentPassword, userPassword);
  };
}
