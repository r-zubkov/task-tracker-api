import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';

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

}
