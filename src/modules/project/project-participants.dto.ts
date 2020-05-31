import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

export class ProjectParticipantsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  userIds: string[];
}
