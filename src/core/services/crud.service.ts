import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  ApiActionResponse,
  ApiEntityResponse,
  ApiListResponse,
  ApiResponseHelper,
} from '../../shared/helpers/api-response.helper';

export abstract class CrudService<Entity> {

  protected abstract readonly entityAlias: string;

  protected constructor(
    protected repository: Repository<Entity>
  ) {}

  protected abstract _buildQuery(user: User, uuid?: string): SelectQueryBuilder<Entity>;

  async getEntity(user: User, uuid: string): Promise<ApiEntityResponse<Entity> | HttpException> {
    const entity = await (this._buildQuery(user, uuid)).getOne();

    if (!entity) {
      throw new HttpException('Entity not found', HttpStatus.NOT_FOUND)
    }

    return ApiResponseHelper.entity(entity);
  }

  async getEntityList(user: User): Promise<ApiListResponse<Entity>> {
    const query = this._buildQuery(user);

    const result = await query
      .orderBy(`${this.entityAlias}.created`, 'DESC')
      .getMany();
    return ApiResponseHelper.list(result);
  }

  async createEntity(entity: any): Promise<ApiActionResponse | HttpException> {
    try {
      const result = await this.repository.insert(entity);
      return ApiResponseHelper.successAction('Entity successfully created', result);
    } catch (err) {
      throw new HttpException("An error occurred while creating entity", HttpStatus.BAD_REQUEST)
    }
  }

  async updateEntity(user: User, entityDto: any, uuid: string): Promise<ApiActionResponse | HttpException> {
    try {
      // check if entity exist, and user has access
      const entity = await (this._buildQuery(user, uuid)).getOne();
      if (!entity) return new NotFoundException();

      const result = await this.repository.update(uuid, entityDto);
      return ApiResponseHelper.successAction('Entity successfully updated', result);
    } catch (err) {
      switch (err['status']) {
        case 404:
          throw new HttpException("Entity not found", HttpStatus.NOT_FOUND)
        default:
          throw new HttpException("An error occurred while updating entity", HttpStatus.BAD_REQUEST)
      }
    }
  }

  protected async updateStatus(user: User, uuid: string, newStatus: boolean): Promise<ApiActionResponse | HttpException> {
    // check if entity exist, and user has access
    const entity = await (this._buildQuery(user, uuid)).getOne();
    if (!entity) {
      throw new HttpException("Entity not found", HttpStatus.NOT_FOUND)
    }

    try {
      entity['isActive'] = newStatus;
      const result = await this.repository.update(uuid, entity);
      return ApiResponseHelper.successAction('Entity status successfully updated', result);
    } catch (err) {
      throw new HttpException('An error occurred while updating entity status', HttpStatus.BAD_REQUEST)
    }
  }
}