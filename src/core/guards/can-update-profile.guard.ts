import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../modules/user/user.entity';

@Injectable()
export class CanUpdateProfileGuard implements CanActivate {

  constructor(private userUUID: string = null) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const userUUID: string = this.userUUID || request.params.userUuid;

    return user.isAdmin || user.id === userUUID;
  }
}