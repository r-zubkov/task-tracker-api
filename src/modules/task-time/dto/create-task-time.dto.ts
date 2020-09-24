import { IsInt, IsOptional, IsPositive, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import { Task } from '../../task/task.entity';
import { User } from '../../user/user.entity';
import { Expose } from 'class-transformer';

export class CreateTaskTimeDto {
  @IsString()
  @Length(19, 19)
  @Expose()
  @IsOptional()
  readonly date: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(4294967295)
  @Expose()
  readonly timeSpent: number;

  @IsUUID()
  readonly task: Task;

  @IsUUID()
  readonly author: User;
}
