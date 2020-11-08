import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiEntityResponse, ApiListResponse, ApiResponseHelper } from '../../shared/helpers/api-response.helper';

export abstract class CrudService<Entity> {

  protected abstract entityAlias: string;
  protected abstract _buildQuery(user: User, uuid?: string): SelectQueryBuilder<Entity>;

  protected constructor(
    protected repository: Repository<Entity>
  ) {}

  async getEntity(user: User, uuid: string): Promise<ApiEntityResponse<Entity> | HttpException> {
    const entity = await (this._buildQuery(user, uuid)).getOne();

    if (!entity) {
      throw new HttpException(`Entity not found`, HttpStatus.NOT_FOUND)
    }

    return ApiResponseHelper.entity(entity);
  }

  async getEntityList(user: User): Promise<ApiListResponse<Entity[]>> {
    const query = this._buildQuery(user);

    const result = await query
      .orderBy(`${this.entityAlias}.created`, 'DESC')
      .getMany();
    return ApiResponseHelper.list(result);
  }
}