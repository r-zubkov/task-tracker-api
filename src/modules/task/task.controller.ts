import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@Controller('task')
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  get(@Param() params) {
    return this.taskService.get(params.id);
  }

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @Post()
  create(@Body(new ValidationPipe()) task: CreateTaskDto) {
    return this.taskService.create(task);
  }

  @Put(':id')
  update(@Body(new ValidationPipe()) task: UpdateTaskDto, @Param() params) {
    return this.taskService.update(task, params.id);
  }

}
