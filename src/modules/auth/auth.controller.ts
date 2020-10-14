import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('sign-up')
  public async register(@Body(new ValidationPipe()) user: CreateUserDto) {
    return await this.authService.signUp(user);
  }

  @Post('sign-in')
  public async login(@Body(new ValidationPipe()) user: LoginUserDto) {
    return await this.authService.signIn(user);
  }
}
