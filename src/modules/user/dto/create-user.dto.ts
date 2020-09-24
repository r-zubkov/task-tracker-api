import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @Length(5, 32)
  @IsEmail()
  @Expose()
  readonly email: string;

  @IsString()
  @Length(5, 20)
  @Expose()
  readonly password: string;

  @IsString()
  @Length(1, 30)
  @Expose()
  readonly firstName: string;

  @IsString()
  @Length(1, 30)
  @Expose()
  @IsOptional()
  readonly middleName?: string;

  @IsString()
  @Length(1, 30)
  @Expose()
  readonly lastName: string;

  @IsString()
  @Length(10, 10)
  @Expose()
  @IsOptional()
  readonly birthDate: string;

  @IsString()
  @Length(1, 15)
  @Expose()
  @IsOptional()
  readonly number: string;

  @IsString()
  @Length(1, 500)
  @Expose()
  @IsOptional()
  readonly description?: string;
}
