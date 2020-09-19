import { UserRole } from '../../modules/user/user.entity';
import { RoleGuard } from '../guards/role.guard';
import { UseGuards } from '@nestjs/common';

export const Role = (role: UserRole) => UseGuards(new RoleGuard(role));