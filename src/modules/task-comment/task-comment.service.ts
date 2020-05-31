import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { TaskComment } from './task-comment.entity';
import { DateHelper } from '../../common/helpers/date.helper';
import { CreateTaskCommentDto } from './create-task-comment.dto';
import { UpdateTaskCommentDto } from './update-task-comment.dto';

@Injectable()
export class TaskCommentService {

  constructor(
    @InjectRepository(TaskComment)
    private taskCommentRepository: Repository<TaskComment>
  ) {}

  async get(id: string): Promise<TaskComment> {
    return await this.taskCommentRepository.findOne({
      where: {
        id: id
      },
      relations: ['author', 'task'],
    });
  }

  async getAll(): Promise<TaskComment[]> {
    return await this.taskCommentRepository.find({
      relations: ['author', 'task'],
    });
  }

  async create(taskComment: CreateTaskCommentDto): Promise<InsertResult> {
    return await this.taskCommentRepository.insert({
      ...taskComment,
      createdAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async update(taskComment: UpdateTaskCommentDto, taskId: string): Promise<UpdateResult> {
    return await this.taskCommentRepository.update(taskId, {
      ...taskComment,
      updatedAt: DateHelper.formatToDbDateTime(new Date())
    })
  }
}
