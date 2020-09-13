import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/create-user.dto';
import { JwtPayload } from './jwt.strategy';
import { User } from '../user/user.entity';
import { LoginUserDto } from '../user/login-user.dto';

export interface AuthStatus {
  success: boolean;
  message?: string;
  authToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signUp(userDto: CreateUserDto):
    Promise<AuthStatus> {
    let status: AuthStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async signIn(loginUserDto: LoginUserDto): Promise<AuthStatus> {
    const user = await this.usersService.findByEmail(loginUserDto);
    const token = this._createToken(user);

    return {
      success: true, authToken: token,
    };
  }

  private _createToken({ email }: User): any {
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
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
