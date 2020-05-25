import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()

export class TaskService {

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async get(id: string): Promise<Task> {
    return await this.taskRepository.findOne({
      where: {id: id},
      relations: ['executor', 'checker', 'author', 'taskComments'],
    });
  }

  async getAll(): Promise<Task[]> {
    return await this.taskRepository.find(
      { relations: ['executor', 'checker', 'author'], });
  }
}
