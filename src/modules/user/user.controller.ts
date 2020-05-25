import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

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
  create(@Body() user: User) {
    return this.userService.create(user);
  }

  @Put()
  update(@Body() user: User) {
    return this.userService.update(user);
  }

  @Delete(':id')
  block(@Param() params) {
    return this.userService.block(params.id);
  }

  @Post('/unblock/:id')
  unblock(@Param() params) {
    return this.userService.unblock(params.id);
  }
}
