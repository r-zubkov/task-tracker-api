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
  get(@Req() request, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.get(request.user, uuid);
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

  @Post(':uuid/suspend')
  @Role(UserRole.admin)
  suspend(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.delete(uuid);
  }

  @Post(':uuid/activate')
  @Role(UserRole.admin)
  activate(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.projectService.restore(uuid);
  }
}
