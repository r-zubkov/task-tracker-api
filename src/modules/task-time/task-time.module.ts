import { Module } from '@nestjs/common';
import { TaskTimeService } from './task-time.service';
import { TaskTimeController } from './task-time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTime } from './task-time.entity';
import { TaskTimeSubscriber } from './task-time.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTime])],
  providers: [TaskTimeService, TaskTimeSubscriber],
  controllers: [TaskTimeController]
})
export class TaskTimeModule {}
