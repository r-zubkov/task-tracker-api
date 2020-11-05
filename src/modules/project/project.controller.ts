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
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateUpdateProjectDto } from './dto/create-update-project.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UserRole } from '../user/user.entity';
import { Role } from '../../core/decorators/role.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getAll(@Req() request) {
    return this.projectService.getAll(request.user);
  }

  @Get(':uuid')
  get(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() request) {
    return this.projectService.get(uuid, request.user);
  }

  @Post()
  @Role(UserRole.admin)
  create(@Body(new ValidationPipe()) project: CreateUpdateProjectDto, @Req() request) {
    return this.projectService.create(project, request.user);
  }

  @Patch(':uuid')
  @Role(UserRole.admin)
  update(
    @Body(new ValidationPipe()) project: CreateUpdateProjectDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.projectService.update(project, uuid);
  }

  @Post(':uuid/activate')
  @Role(UserRole.admin)
  activate(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.activate(uuid);
  }

  @Post(':uuid/suspend')
  @Role(UserRole.admin)
  suspend(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.suspend(uuid);
  }
}
