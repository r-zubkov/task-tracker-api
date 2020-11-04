import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { ProjectInterceptor } from '../../core/interceptors/project.interceptor';

@Controller('project/:projectId/task')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ProjectInterceptor)
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @Get(':uuid')
  get(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.taskService.get(uuid);
  }

  // TODO
  // @Get(':projectUuid/user-tasks/:userUuid')
  // getTasksByUser(
  //   @Param('projectUuid', ParseUUIDPipe) projectUuid: string,
  //   @Param('userUuid', ParseUUIDPipe) userUuid: string
  // ) {
  //   return this.projectService.getUserTasks(projectUuid, userUuid);
  // }

  @Post()
  create(@Body(new ValidationPipe()) task: CreateTaskDto) {
    return this.taskService.create(task);
  }

  @Put(':uuid')
  update(
    @Body(new ValidationPipe()) task: UpdateTaskDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.taskService.update(task, uuid);
  }

  @Post(':uuid/update-status')
  updateStatus(
    @Body(new ValidationPipe()) status: UpdateTaskStatusDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.taskService.updateStatus(status, uuid);
  }
}
