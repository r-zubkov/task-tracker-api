import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User, UserRole } from '../../modules/user/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private role: UserRole) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    return user.role === this.role;
  }
}