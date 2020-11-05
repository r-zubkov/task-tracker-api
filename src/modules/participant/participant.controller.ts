import {
  Body,
  Controller, Delete,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { ProjectInterceptor } from '../../core/interceptors/project.interceptor';
import { ParticipantService } from './participant.service';
import { Role } from '../../core/decorators/role.decorator';
import { UserRole } from '../user/user.entity';
import { ProjectParticipantsDto } from './dto/project-participants.dto';

@Controller('projects/:projectId/participants')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ProjectInterceptor)
export class ParticipantController {

  constructor(private readonly participantService: ParticipantService) {}

  @Get()
  getAll(@Req() request) {
    return this.participantService.getAll(request.project);
  }

  @Post()
  @Role(UserRole.admin)
  addParticipant(
    @Body(new ValidationPipe()) projectParticipants: ProjectParticipantsDto,
    @Req() request
  ) {
    return this.participantService.addParticipants(projectParticipants, request.project);
  }

  @Delete()
  @Role(UserRole.admin)
  deleteParticipants(
    @Body(new ValidationPipe()) projectParticipants: ProjectParticipantsDto,
    @Req() request
  ) {
    return this.participantService.deleteParticipants(projectParticipants, request.project);
  }

}