import { ApiActionResponse, ApiEntityResponse, ApiListResponse } from '../../shared/helpers/api-response.helper';
import { HttpException } from '@nestjs/common';

export interface CrudInterface<Entity> {
  getAll?(...args): Promise<ApiListResponse<Entity>>;
  get?(...args): Promise<ApiEntityResponse<Entity> | HttpException>;
  create?(...args): Promise<ApiActionResponse | HttpException>;
  update?(...args): Promise<ApiActionResponse | HttpException>;
}