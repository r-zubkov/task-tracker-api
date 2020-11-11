import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { ApiActionResponse, ApiEntityResponse, ApiListResponse } from '../../shared/helpers/api-response.helper';
import { CrudService } from '../../core/services/crud.service';
import { Crud } from '../../core/interfaces/crud.interface';

@Injectable()
export class UserService extends CrudService<User> implements Crud<User> {

  protected readonly entityAlias = 'user';

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

  async getAll(user: User): Promise<ApiListResponse<User>> {
    return this.getEntityList(user);
  }

  async get(user: User, uuid: string): Promise<ApiEntityResponse<User> | HttpException> {
    return this.getEntity(user, uuid);
  }

  async create(user: CreateUserDto): Promise<ApiActionResponse | HttpException> {
    return this.createEntity(user)
  }

  async update(user: User, userDto: UpdateUserDto, userUUID: string): Promise<ApiActionResponse | HttpException> {
    return this.updateEntity(user, userDto, userUUID);
  }

  async delete(uuid: string): Promise<ApiActionResponse | HttpException> {
    return this.updateStatus(uuid, false, 'User', 'blocked', 'blocking')
  }

  async restore(uuid: string): Promise<ApiActionResponse | HttpException> {
    return this.updateStatus(uuid, true, 'User', 'activated', 'activating')
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
