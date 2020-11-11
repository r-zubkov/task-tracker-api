import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { Expose } from 'class-transformer';
import { PriorityType } from '../task.entity';
import { User } from '../../user/user.entity';

export class UpdateTaskDto {
  @IsString()
  @Length(1, 50)
  @Expose()
  readonly name: string;

  @IsEnum(PriorityType)
  @Expose()
  readonly priority: PriorityType;

  @IsString()
  @Length(1, 5000)
  @IsOptional()
  readonly description: string;

  @IsUUID()
  @IsOptional()
  readonly executor: User;

  @IsString()
  @Length(19, 19)
  @IsOptional()
  readonly timeStart: string;

  @IsString()
  @Length(19, 19)
  @IsOptional()
  readonly timeEnd: string;
}
