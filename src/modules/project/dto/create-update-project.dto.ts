import { IsOptional, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUpdateProjectDto {
  @IsString()
  @Length(1, 50)
  @Expose()
  readonly name: string;

  @IsString()
  @Length(1, 500)
  @Expose()
  @IsOptional()
  readonly description: string;
}
