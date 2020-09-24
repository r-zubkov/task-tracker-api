import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { TaskTimeService } from './task-time.service';
import { CreateTaskTimeDto } from './dto/create-task-time.dto';
import { UpdateTaskTimeDto } from './dto/update-task-time.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@Controller('task-time')
@UseGuards(JwtAuthGuard)
export class TaskTimeController {

  constructor(private readonly taskTimeService: TaskTimeService) {}

  @Get(':uuid')
  get(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.taskTimeService.get(uuid);
  }

  @Get()
  getAll() {
    return this.taskTimeService.getAll();
  }

  @Post()
  create(@Body(new ValidationPipe()) taskTime: CreateTaskTimeDto) {
    return this.taskTimeService.create(taskTime);
  }

  @Put(':uuid')
  update(
    @Body(new ValidationPipe()) taskTime: UpdateTaskTimeDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.taskTimeService.update(taskTime, uuid);
  }
}
