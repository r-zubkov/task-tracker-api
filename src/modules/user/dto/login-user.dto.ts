import { IsEmail, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginUserDto {
  @IsString()
  @Length(5, 32)
  @IsEmail()
  @Expose()
  readonly email: string;

  @IsString()
  @Length(5, 20)
  @Expose()
  readonly password: string;
}
