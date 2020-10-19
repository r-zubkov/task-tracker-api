import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { ProjectInterceptor } from '../../core/interceptors/project.interceptor';

@Controller('project/:projectId/participant')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ProjectInterceptor)
export class ParticipantController {

  @Get()
  getAll(@Req() request) {
    return [];
  }

}