import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { TaskCommentService } from './task-comment.service';
import { CreateTaskCommentDto } from './create-task-comment.dto';
import { UpdateTaskCommentDto } from './update-task-comment.dto';

@Controller('task-comment')
export class TaskCommentController {

  constructor(private readonly taskCommentService: TaskCommentService) {}

  @Get(':id')
  get(@Param() params) {
    return this.taskCommentService.get(params.id);
  }

  @Get()
  getAll() {
    return this.taskCommentService.getAll();
  }

  @Post()
  create(@Body(new ValidationPipe()) taskComment: CreateTaskCommentDto) {
    return this.taskCommentService.create(taskComment);
  }

  @Put(':id')
  update(@Body(new ValidationPipe()) taskComment: UpdateTaskCommentDto, @Param() params) {
    return this.taskCommentService.update(taskComment, params.id);
  }
}
