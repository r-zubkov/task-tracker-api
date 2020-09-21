import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto';
import { TaskService } from '../task/task.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Role } from '../../core/decorators/role.decorator';
import { UserRole } from './user.entity';
import { ProfileUpdate } from '../../core/decorators/profile-update.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  @Get(':userUuid')
  get(@Param('userUuid', ParseUUIDPipe) uuid: string) {
    return this.userService.get(uuid);
  }

  @Get()
  @Role(UserRole.admin)
  getAll() {
    return this.userService.getAll();
  }

  @Get(':userUuid/tracked-time')
  getTasksByUser(@Param('userUuid', ParseUUIDPipe) uuid: string) {
    return this.taskService.getUserTrackedTime(uuid);
  }

  @Put(':userUuid')
  @ProfileUpdate()
  update(
    @Body(new ValidationPipe()) user: UpdateUserDto,
    @Param('userUuid', ParseUUIDPipe) uuid: string
  ) {
    return this.userService.update(user, uuid);
  }

  @Delete(':userUuid')
  @Role(UserRole.admin)
  block(@Param('userUuid', ParseUUIDPipe) uuid: string) {
    return this.userService.block(uuid);
  }

  @Post(':userUuid/unblock')
  @Role(UserRole.admin)
  unblock(@Param('userUuid', ParseUUIDPipe) uuid: string) {
    return this.userService.unblock(uuid);
  }
}
