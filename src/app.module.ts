import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { TaskCommentModule } from './modules/task-comment/task-comment.module';
import { TaskTimeModule } from './modules/task-time/task-time.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './modules/user/user.entity';
import { Project } from './modules/project/project.entity';
import { Task } from './modules/task/task.entity';
import { TaskComment } from './modules/task-comment/task-comment.entity';
import { TaskTime } from './modules/task-time/task-time.entity';
import { ParticipantModule } from './modules/participant/participant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['src/env/.database.env', 'src/env/.auth.env']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        logging: configService.get<boolean>('DATABASE_LOGGING'),
        entities: [
          User,
          Project,
          Task,
          TaskComment,
          TaskTime
        ],
        synchronize: true,
      })
    }),
    AuthModule,
    ProjectModule,
    ParticipantModule,
    TaskModule,
    TaskCommentModule,
    TaskTimeModule
  ]
})
export class AppModule {}
