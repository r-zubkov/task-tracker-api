import { IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateTaskCommentDto {

  @IsString()
  @Length(1, 1000)
  @Expose()
  readonly text: string;

  @IsString()
  @Length(1, 150)
  @Expose()
  readonly changeReason: string;
}
