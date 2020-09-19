import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task.entity';
import { TaskFlowService } from '../task/task-flow.service';
import { UserSubscriber } from './user.subscriber';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Task])
  ],
  providers: [UserService, UserSubscriber, TaskService, TaskFlowService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
