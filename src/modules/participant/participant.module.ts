import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { ProjectService } from '../project/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ParticipantController],
  providers: [ParticipantService, ProjectService, UserService]
})
export class ParticipantModule {}
