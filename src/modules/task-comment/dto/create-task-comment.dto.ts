import { IsString, IsUUID, Length } from 'class-validator';
import { Task } from '../../task/task.entity';
import { User } from '../../user/user.entity';
import { Expose } from 'class-transformer';

export class CreateTaskCommentDto {

  @IsString()
  @Length(1, 1000)
  @Expose()
  readonly text: string;

  @IsUUID()
  readonly task: Task;

  @IsUUID()
  readonly author: User;
}
