import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UserRole } from '../user/user.entity';
import { Role } from '../../core/decorators/role.decorator';

@Controller('project')
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
  create(@Body(new ValidationPipe()) project: CreateProjectDto, @Req() request) {
    return this.projectService.create(project, request.user);
  }

  @Put(':uuid')
  @Role(UserRole.admin)
  update(
    @Body(new ValidationPipe()) project: UpdateProjectDto,
    @Param('uuid', ParseUUIDPipe) uuid: string
  ) {
    return this.projectService.update(project, uuid);
  }

  @Delete(':uuid')
  @Role(UserRole.admin)
  archive(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.suspend(uuid);
  }

  @Post(':uuid/suspend')
  @Role(UserRole.admin)
  suspend(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.suspend(uuid);
  }

  @Post(':uuid/activate')
  @Role(UserRole.admin)
  activate(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.activate(uuid);
  }
}
