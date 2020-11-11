import { ApiActionResponse, ApiEntityResponse, ApiListResponse } from '../../shared/helpers/api-response.helper';
import { HttpException } from '@nestjs/common';

export interface Crud<Entity> {
  getAll?(...args): Promise<ApiListResponse<Entity>>;
  get?(...args): Promise<ApiEntityResponse<Entity> | HttpException>;
  create?(...args): Promise<ApiActionResponse | HttpException>;
  update?(...args): Promise<ApiActionResponse | HttpException>;
  delete?(...args): Promise<ApiActionResponse | HttpException>;
  restore?(...args): Promise<ApiActionResponse | HttpException>;
}