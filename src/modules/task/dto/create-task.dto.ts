import { IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { PriorityType } from '../task.entity';
import { Project } from '../../project/project.entity';
import { User } from '../../user/user.entity';

export class CreateTaskDto {
  @IsString()
  @Length(1, 50)
  @Expose()
  readonly name: string;

  @IsEnum(PriorityType)
  readonly priority: PriorityType;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(4294967295)
  @Expose()
  readonly estimatedTime: number;

  @IsString()
  @Length(1, 5000)
  @Expose()
  @IsOptional()
  readonly description: string;

  @IsUUID()
  readonly project: Project;

  @IsUUID()
  readonly executor: User;

  @IsUUID()
  readonly checker: User;

  @IsUUID()
  readonly author: User;

  @IsString()
  @Length(19, 19)
  @Expose()
  @IsOptional()
  readonly timeStart: string;

  @IsString()
  @Length(19, 19)
  @Expose()
  @IsOptional()
  readonly timeEnd: string;
}
