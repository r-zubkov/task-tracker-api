import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectParticipantsDto } from './project-participants.dto';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

@Controller('project')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Get(':id')
  get(@Param() params) {
    return this.projectService.get(params.id);
  }

  @Get()
  getAll() {
    return this.projectService.getAll();
  }

  @Get(':projectId/user-tasks/:userId')
  getTasksByUser(@Param() params) {
    return this.projectService.getUserTasks(params.projectId, params.userId);
  }

  @Post()
  create(@Body(new ValidationPipe()) project: CreateProjectDto) {
    return this.projectService.create(project);
  }

  @Put(':id')
  update(@Body(new ValidationPipe()) project: UpdateProjectDto, @Param() params) {
    return this.projectService.update(project, params.id);
  }

  @Delete(':id')
  archive(@Param() params) {
    return this.projectService.suspend(params.id);
  }

  @Post(':id/activate')
  unblock(@Param() params) {
    return this.projectService.activate(params.id);
  }

  @Post(':id/add-participants')
  addParticipant(
    @Body(new ValidationPipe()) projectParticipants: ProjectParticipantsDto,
    @Param() params
  ) {
    return this.projectService.addParticipant(projectParticipants, params.id);
  }
}
