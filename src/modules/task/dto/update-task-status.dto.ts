import { IsEnum } from 'class-validator';
import { TaskStatusType } from '../task.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatusType)
  readonly newStatus: TaskStatusType;
}
