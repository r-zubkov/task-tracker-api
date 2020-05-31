import { IsInt, IsOptional, IsPositive, IsString, Length, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateTaskTimeDto {
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

  @IsString()
  @Length(1, 150)
  @Expose()
  readonly changeReason: string;
}
