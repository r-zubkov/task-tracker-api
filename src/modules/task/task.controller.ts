import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateUpdateTaskDto } from './dto/create-update-task.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { ProjectInterceptor } from '../../core/interceptors/project.interceptor';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ProjectInterceptor)
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(@Req() request) {
    return this.taskService.getAll(request.user);
  }

  @Get(':uuid')
  get(@Req() request, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.taskService.get(request.user, uuid);
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
  create(@Req() request, @Body(new ValidationPipe()) task: CreateUpdateTaskDto) {
    return this.taskService.create(request.user, request.project, task);
  }

  @Patch(':uuid')
  update(
    @Req() request,
    @Body(new ValidationPipe()) task: CreateUpdateTaskDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.taskService.update(request.user, task, uuid);
  }

  // @Post(':uuid/update-status')
  // updateStatus(
  //   @Body(new ValidationPipe()) status: UpdateTaskStatusDto,
  //   @Param('uuid', ParseUUIDPipe) uuid: string
  // ) {
  //   return this.taskService.updateStatus(status, uuid);
  // }
}
