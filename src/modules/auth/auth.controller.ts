import { Body, Controller, HttpException, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService, AuthStatus } from './auth.service';
import { CreateUserDto } from '../user/create-user.dto';
import { LoginUserDto } from '../user/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('sign-up')
  public async register(@Body(new ValidationPipe()) user: CreateUserDto): Promise<AuthStatus> {
    const result: AuthStatus = await this.authService.signUp(user);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('sign-in')
  public async login(@Body(new ValidationPipe()) user: LoginUserDto): Promise<AuthStatus> {
    return await this.authService.signIn(user);
  }
}
