import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { ProjectModule } from './modules/project/project.module';
import { Project } from './modules/project/project.entity';
import { TaskModule } from './modules/task/task.module';
import { Task } from './modules/task/task.entity';
import { TaskComment } from './modules/task-comment/task-comment.entity';
import { TaskCommentModule } from './modules/task-comment/task-comment.module';
import { TaskTime } from './modules/task-time/task-time.entity';
import { TaskTimeModule } from './modules/task-time/task-time.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.10.1.3',
      port: 3306,
      username: 'timetracker',
      password: 'timetracker',
      database: 'timetracker',
      entities: [
        User,
        Project,
        Task,
        TaskComment,
        TaskTime
      ],
      synchronize: true,
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    TaskCommentModule,
    TaskTimeModule
  ]
})
export class AppModule {}
