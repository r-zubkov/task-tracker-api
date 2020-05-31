import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  get(@Param() params) {
    return this.userService.get(params.id);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
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
