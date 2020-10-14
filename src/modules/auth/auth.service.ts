import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtPayload } from './jwt.strategy';
import { User } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiResponseHelper } from '../../shared/helpers/api-response.helper';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signUp(userDto: CreateUserDto): Promise<ApiResponse | HttpException> {
    try {
      await this.usersService.create(userDto);
      return ApiResponseHelper.generateSuccessMessage('User successfully registered')
    } catch (err) {
      throw new HttpException("An error occurred while registering user", HttpStatus.BAD_REQUEST)
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<ApiResponse> {
    const user = await this.usersService.findByEmail(loginUserDto);
    const token = this._createToken(user);

    return ApiResponseHelper.generateSuccessMessage('Success', null, { authToken: token })
  }

  private _createToken({ email }: User): any {
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: this.configService.get('AUTH_EXPIRESIN'),
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
