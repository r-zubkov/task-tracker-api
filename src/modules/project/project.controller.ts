import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { IProjectParticipants, ProjectService } from './project.service';
import { Project } from './project.entity';

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

  @Post('add-participants')
  addParticipant(@Body() projectParticipants: IProjectParticipants) {
    return this.projectService.addParticipant(projectParticipants);
  }

}
