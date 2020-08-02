import { Module } from '@nestjs/common';
import { TaskCommentService } from './task-comment.service';
import { TaskCommentController } from './task-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from './task-comment.entity';
import { TaskCommentSubscriber } from './task-comment.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([TaskComment])],
  providers: [TaskCommentService, TaskCommentSubscriber],
  controllers: [TaskCommentController]
})
export class TaskCommentModule {}
