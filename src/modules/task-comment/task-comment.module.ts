import { Module } from '@nestjs/common';
import { TaskCommentService } from './task-comment.service';
import { TaskCommentController } from './task-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskComment } from './task-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskComment])],
  providers: [TaskCommentService],
  controllers: [TaskCommentController]
})
export class TaskCommentModule {}
