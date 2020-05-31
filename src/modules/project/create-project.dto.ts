import { IsOptional, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';
import { User } from '../user/user.entity';

export class CreateProjectDto {
  @IsString()
  @Length(1, 50)
  @Expose()
  readonly name: string;

  @IsString()
  @Length(1, 500)
  @Expose()
  @IsOptional()
  readonly description: string;

  @IsString()
  @Length(36, 36)
  @Expose()
  readonly owner: User;
}
