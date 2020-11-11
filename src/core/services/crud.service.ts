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

  protected abstract readonly entityAlias: string;

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

  protected async updateStatus(
    uuid: string,
    newStatus: boolean,
    entityName: string,
    completedText: string,
    progressingText: string,
  ): Promise<ApiActionResponse | HttpException> {
    const entity = await this.repository.findOne({
      where: {
        id: uuid,
        isActive: !newStatus
      }});

    if (!entity) {
      throw new HttpException("Invalid request", HttpStatus.BAD_REQUEST)
    }

    try {
      entity['isActive'] = newStatus;
      const result = await this.repository.update(uuid, entity);
      return ApiResponseHelper.successAction(`${entityName} successfully ${completedText}`, result);
    } catch (err) {
      throw new HttpException(`An error occurred while ${progressingText} ${entityName.toLowerCase()}`, HttpStatus.BAD_REQUEST)
    }
  }
}