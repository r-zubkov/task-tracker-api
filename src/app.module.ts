import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { ProjectModule } from './modules/project/project.module';
import { Project } from './modules/project/project.entity';

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
        Project
      ],
      synchronize: true,
    }),
    UserModule,
    ProjectModule,
  ]
})
export class AppModule {}
