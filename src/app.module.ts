import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.10.1.3',
      port: 3306,
      username: 'timetracker',
      password: 'timetracker',
      database: 'timetracker',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ]
})
export class AppModule {}
