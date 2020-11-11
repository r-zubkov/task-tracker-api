import { UseGuards } from '@nestjs/common';
import { CanUpdateProfileGuard } from '../guards/can-update-profile.guard';

export const CanUpdateProfile = (uuid: string = null) => UseGuards(new CanUpdateProfileGuard(uuid));