import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { TaskCommentService } from './task-comment.service';
import { CreateTaskCommentDto } from './create-task-comment.dto';
import { UpdateTaskCommentDto } from './update-task-comment.dto';
import { JwtAuthGuard } from '../../core/jwt-auth.guard';

@Controller('task-comment')
@UseGuards(JwtAuthGuard)
export class TaskCommentController {

  constructor(private readonly taskCommentService: TaskCommentService) {}

  @Get(':uuid')
  get(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.taskCommentService.get(uuid);
  }

  @Get()
  getAll() {
    return this.taskCommentService.getAll();
  }

  @Post()
  create(@Body(new ValidationPipe()) taskComment: CreateTaskCommentDto) {
    return this.taskCommentService.create(taskComment);
  }

  @Put(':uuid')
  update(
    @Body(new ValidationPipe()) taskComment: UpdateTaskCommentDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.taskCommentService.update(taskComment, uuid);
  }
}
