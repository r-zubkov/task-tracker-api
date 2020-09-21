import { UserRole } from '../../modules/user/user.entity';
import { UserRoleGuard } from '../guards/user-role.guard';
import { UseGuards } from '@nestjs/common';

export const Role = (role: UserRole) => UseGuards(new UserRoleGuard(role));