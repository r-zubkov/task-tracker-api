import { UseGuards } from '@nestjs/common';
import { ProfileUpdateGuard } from '../guards/profile-update.guard';

export const ProfileUpdate = (uuid: string = null) => UseGuards(new ProfileUpdateGuard(uuid));