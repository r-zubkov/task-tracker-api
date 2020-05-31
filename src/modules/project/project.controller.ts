import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { ProjectParticipantsDto } from './project-participants.dto';

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

  @Post()
  create(@Body() project: Project) {
    return this.projectService.create(project);
  }

  @Put()
  update(@Body() project: Project) {
    return this.projectService.update(project);
  }

  @Delete(':id')
  archive(@Param() params) {
    return this.projectService.suspend(params.id);
  }

  @Post('/activate/:id')
  unblock(@Param() params) {
    return this.projectService.activate(params.id);
  }

  @Post('add-participants')
  addParticipant(@Body() projectParticipants: ProjectParticipantsDto) {
    return this.projectService.addParticipant(projectParticipants);
  }
}
