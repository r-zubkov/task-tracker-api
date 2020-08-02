import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { ProjectSubscriber } from './project.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  providers: [ProjectService, ProjectSubscriber, UserService],
  controllers: [ProjectController]
})
export class ProjectModule {}
