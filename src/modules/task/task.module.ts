import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskFlowService } from './task-flow.service';
import { TaskSubscriber } from './tast.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService, TaskSubscriber, TaskFlowService],
  controllers: [TaskController]
})
export class TaskModule {}
