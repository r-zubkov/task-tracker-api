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

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  @Get(':uuid')
  get(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.get(uuid);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':uuid/tracked-time')
  getTasksByUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.taskService.getUserTrackedTime(uuid);
  }

  @Put(':uuid')
  update(
    @Body(new ValidationPipe()) user: UpdateUserDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.userService.update(user, uuid);
  }

  @Delete(':uuid')
  block(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.block(uuid);
  }

  @Post(':uuid/unblock')
  unblock(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.unblock(uuid);
  }
}
