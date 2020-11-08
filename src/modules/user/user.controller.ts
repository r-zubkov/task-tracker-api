import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TaskService } from '../task/task.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Role } from '../../core/decorators/role.decorator';
import { UserRole } from './user.entity';
import { ProfileUpdate } from '../../core/decorators/profile-update.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  @Get()
  @Role(UserRole.admin)
  getAll(@Req() request) {
    return this.userService.getAll(request.user);
  }

  @Get(':uuid')
  get(@Req() request, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.get(request.user, uuid);
  }

  @Get(':userUuid/tracked-time')
  getTasksByUser(@Param('userUuid', ParseUUIDPipe) uuid: string) {
    return this.taskService.getUserTrackedTime(uuid);
  }

  @Put(':userUUID')
  @ProfileUpdate()
  update(
    @Body(new ValidationPipe()) user: UpdateUserDto,
    @Param('userUUID', ParseUUIDPipe) uuid: string
  ) {
    return this.userService.update(user, uuid);
  }

  @Delete(':uuid')
  @Role(UserRole.admin)
  block(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.block(uuid);
  }

  @Post(':uuid/unblock')
  @Role(UserRole.admin)
  unblock(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.unblock(uuid);
  }
}
