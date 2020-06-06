import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectParticipantsDto } from './project-participants.dto';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

@Controller('project')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Get(':uuid')
  get(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.get(uuid);
  }

  @Get()
  getAll() {
    return this.projectService.getAll();
  }

  @Get(':projectUuid/user-tasks/:userUuid')
  getTasksByUser(
    @Param('projectUuid', ParseUUIDPipe) projectUuid: string,
    @Param('userUuid', ParseUUIDPipe) userUuid: string
  ) {
    return this.projectService.getUserTasks(projectUuid, userUuid);
  }

  @Post()
  create(@Body(new ValidationPipe()) project: CreateProjectDto) {
    return this.projectService.create(project);
  }

  @Put(':uuid')
  update(
    @Body(new ValidationPipe()) project: UpdateProjectDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.projectService.update(project, uuid);
  }

  @Delete(':uuid')
  archive(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.suspend(uuid);
  }

  @Post(':uuid/activate')
  unblock(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.activate(uuid);
  }

  @Post(':uuid/add-participants')
  addParticipant(
    @Body(new ValidationPipe()) projectParticipants: ProjectParticipantsDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.projectService.addParticipant(projectParticipants, uuid);
  }
}
