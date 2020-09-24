import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { TaskTime } from './task-time.entity';
import { CreateTaskTimeDto } from './dto/create-task-time.dto';
import { UpdateTaskTimeDto } from './dto/update-task-time.dto';

@Injectable()
export class TaskTimeService {

  constructor(
    @InjectRepository(TaskTime)
    private taskCommentRepository: Repository<TaskTime>
  ) {}

  async get(uuid: string): Promise<TaskTime> {
    return await this.taskCommentRepository.findOne({
      where: {
        id: uuid
      },
      relations: ['author', 'task'],
    });
  }

  async getAll(): Promise<TaskTime[]> {
    return await this.taskCommentRepository.find({
      relations: ['author', 'task'],
    });
  }

  async create(taskTime: CreateTaskTimeDto): Promise<InsertResult> {
    return await this.taskCommentRepository.insert(taskTime)
  }

  async update(taskTime: UpdateTaskTimeDto, taskTimeUuid: string): Promise<UpdateResult> {
    return await this.taskCommentRepository.update(taskTimeUuid, taskTime)
  }
}
