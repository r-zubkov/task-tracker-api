import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { TaskService } from '../task/task.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  @Get(':id')
  get(@Param() params) {
    return this.userService.get(params.id);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id/tracked-time')
  getTasksByUser(@Param() params) {
    return this.taskService.getUserTrackedTime(params.id);
  }

  @Post()
  create(@Body(new ValidationPipe()) user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Put(':id')
  update(@Body(new ValidationPipe()) user: UpdateUserDto, @Param() params) {
    return this.userService.update(user, params.id);
  }

  @Delete(':id')
  block(@Param() params) {
    return this.userService.block(params.id);
  }

  @Post(':id/unblock')
  unblock(@Param() params) {
    return this.userService.unblock(params.id);
  }
}
