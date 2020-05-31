import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Task } from './task.entity';
import { DateHelper } from '../../common/helpers/date.helper';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()

export class TaskService {

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async get(id: string): Promise<Task> {
    return await this.taskRepository.findOne({
      where: {id: id},
      relations: ['project', 'executor', 'checker', 'author', 'taskComments', 'taskComments.author', 'taskTrackedTime'],
    });
  }

  async getAll(): Promise<Task[]> {
    return await this.taskRepository.find(
      { relations: ['project', 'executor', 'checker', 'author'], });
  }

  async create(task: CreateTaskDto): Promise<InsertResult> {
    return await this.taskRepository.insert({
      ...task,
      createdAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async update(task: UpdateTaskDto, projectId: string): Promise<UpdateResult> {
    return await this.taskRepository.update(projectId, {
      ...task,
      updatedAt: DateHelper.formatToDbDateTime(new Date())
    })
  }
}
