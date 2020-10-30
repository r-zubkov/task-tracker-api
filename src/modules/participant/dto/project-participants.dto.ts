import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray } from 'class-validator';

export class ProjectParticipantsDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  userIds: string[];
}
