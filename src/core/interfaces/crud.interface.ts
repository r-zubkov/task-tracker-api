import { ApiEntityResponse, ApiListResponse } from '../../shared/helpers/api-response.helper';
import { User } from '../../modules/user/user.entity';
import { HttpException } from '@nestjs/common';

export interface CrudInterface<Entity> {
  getAll?(user: User): Promise<ApiListResponse<Entity>>;
  get?(user: User, uuid: string): Promise<ApiEntityResponse<Entity> | HttpException>;
}