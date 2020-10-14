import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../modules/user/user.entity';

@Injectable()
export class ProfileUpdateGuard implements CanActivate {

  constructor(private userUuid: string = null) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const userUuid: string = this.userUuid || request.params.userUuid;

    return user.isAdmin || user.id === userUuid;
  }
}