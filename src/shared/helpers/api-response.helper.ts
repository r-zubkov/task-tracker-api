import { InsertResult, UpdateResult } from 'typeorm';

export interface ApiResponse {
  success: boolean;
  message?: string;
  entityId?: string;
}

export interface ResponseAdditionalFields {
  authToken?: string;
}

export class ApiResponseHelper {
  static successActionResponse(
    message: string,
    entity: InsertResult | UpdateResult | null = null,
    additionalFields: ResponseAdditionalFields | null = null
  ): ApiResponse {
    let response: ApiResponse = {
      success: true,
      message: message,
    }

    if (entity) {
      response = {...response, entityId: entity.generatedMaps[0].id}
    }
    if (additionalFields) {
      response = {...response, ...additionalFields}
    }

    return response;
  }
}
