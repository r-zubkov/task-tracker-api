import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { TaskTimeService } from './task-time.service';
import { CreateTaskTimeDto } from './create-task-time.dto';
import { UpdateTaskTimeDto } from './update-task-time.dto';

@Controller('task-time')
export class TaskTimeController {

  constructor(private readonly taskTimeService: TaskTimeService) {}

  @Get(':id')
  get(@Param() params) {
    return this.taskTimeService.get(params.id);
  }

  @Get()
  getAll() {
    return this.taskTimeService.getAll();
  }

  @Post()
  create(@Body(new ValidationPipe()) taskTime: CreateTaskTimeDto) {
    return this.taskTimeService.create(taskTime);
  }

  @Put(':id')
  update(@Body(new ValidationPipe()) taskTime: UpdateTaskTimeDto, @Param() params) {
    return this.taskTimeService.update(taskTime, params.id);
  }
}
