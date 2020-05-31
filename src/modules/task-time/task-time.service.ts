import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { DateHelper } from '../../common/helpers/date.helper';
import { TaskTime } from './task-time.entity';
import { CreateTaskTimeDto } from './create-task-time.dto';
import { UpdateTaskTimeDto } from './update-task-time.dto';

@Injectable()
export class TaskTimeService {

  constructor(
    @InjectRepository(TaskTime)
    private taskCommentRepository: Repository<TaskTime>
  ) {}

  async get(id: string): Promise<TaskTime> {
    return await this.taskCommentRepository.findOne({
      where: {
        id: id
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
    return await this.taskCommentRepository.insert({
      ...taskTime,
      createdAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async update(taskTime: UpdateTaskTimeDto, taskTimeId: string): Promise<UpdateResult> {
    return await this.taskCommentRepository.update(taskTimeId, {
      ...taskTime,
      updatedAt: DateHelper.formatToDbDateTime(new Date())
    })
  }
}
