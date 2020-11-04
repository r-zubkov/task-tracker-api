import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskFlowService } from './task-flow.service';
import { TaskSubscriber } from './tast.subscriber';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project])],
  providers: [TaskService, TaskSubscriber, TaskFlowService, ProjectService],
  controllers: [TaskController]
})
export class TaskModule {}
