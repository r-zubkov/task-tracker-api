import { InsertResult, UpdateResult } from 'typeorm';
import { classToPlain } from 'class-transformer';

export interface ApiActionResponse {
  success: boolean;
  message?: string;
  entity?: any;
}

export interface ActionAdditionalFields {
  authToken?: string;
}

export interface ApiEntityResponse<Entity> {
  success: boolean,
  entity: Entity
}

export interface ApiListResponse<Entity> {
  success: boolean,
  entityList: Entity[]
}

export class ApiResponseHelper {
  static successAction(
    message: string,
    entity: InsertResult | UpdateResult | null = null,
    additionalFields: ActionAdditionalFields | null = null
  ): ApiActionResponse {
    let response: ApiActionResponse = {
      success: true,
      message: message,
    }

    if (entity) {
      response = {...response, entity: classToPlain(entity.generatedMaps[0])}
    }
    if (additionalFields) {
      response = {...response, ...additionalFields}
    }

    return response;
  }

  static entity(entityData: any): ApiEntityResponse<any> {
    return {
      success: true,
      // manually serialize class
      entity: classToPlain(entityData)
    }
  }

  static list(listData: any[]): ApiListResponse<any> {
    return {
      success: true,
      // manually serialize classes
      entityList: listData.map(entity => classToPlain(entity))
    }
  }
}
