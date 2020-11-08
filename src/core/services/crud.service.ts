import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ApiActionResponse,
  ApiEntityResponse,
  ApiListResponse,
  ApiResponseHelper,
} from '../../shared/helpers/api-response.helper';

export abstract class CrudService<Entity> {

  protected abstract entityAlias: string;

  protected constructor(
    protected repository: Repository<Entity>
  ) {}

  protected abstract _buildQuery(user: User, uuid?: string): SelectQueryBuilder<Entity>;

  async getEntity(user: User, uuid: string, notFoundMsg?: string): Promise<ApiEntityResponse<Entity> | HttpException> {
    const entity = await (this._buildQuery(user, uuid)).getOne();

    if (!entity) {
      throw new HttpException(notFoundMsg || 'Entity not found', HttpStatus.NOT_FOUND)
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

  async updateEntity(entity: any, entityUUID: string): Promise<ApiActionResponse | HttpException> {
    try {
      const result = await this.repository.update(entityUUID, entity);
      return ApiResponseHelper.successAction('Entity successfully updated', result);
    } catch (err) {
      throw new HttpException("An error occurred while updating entity", HttpStatus.BAD_REQUEST)
    }
  }
}