import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task.entity';
import { TaskFlowService } from '../task/task-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  providers: [UserService, TaskService, TaskFlowService],
  controllers: [UserController]
})
export class UserModule {}
