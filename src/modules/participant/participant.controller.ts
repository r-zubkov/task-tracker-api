import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { ProjectInterceptor } from '../../core/interceptors/project.interceptor';
import { ParticipantService } from './participant.service';

@Controller('project/:projectId/participant')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ProjectInterceptor)
export class ParticipantController {

  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  getAll(@Req() request) {
    return this.participantService.getAll();
  }

}