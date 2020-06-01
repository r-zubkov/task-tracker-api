import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Task, TaskStatusType } from './task.entity';
import { DateHelper } from '../../common/helpers/date.helper';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { UpdateTaskStatusDto } from './update-task-status.dto';
import { TaskFlowService } from './task-flow.service';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private taskFlowService: TaskFlowService
  ) {}

  async get(id: string): Promise<Task> {
    return await this.taskRepository.findOne({
      where: {id: id},
      relations: ['project', 'executor', 'checker', 'author',
        'taskComments', 'taskComments.author',
        'taskTrackedTime', 'taskTrackedTime.author'],
    });
  }

  async getAll(): Promise<Task[]> {
    return await this.taskRepository.find(
      { relations: ['project', 'executor', 'checker', 'author'], });
  }

  async getUserTrackedTime(userId: string): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect("task.taskTrackedTime", "taskTrackedTime")
      .leftJoinAndSelect("task.project", "project")
      .leftJoinAndSelect("taskTrackedTime.author", "author")
      .where("author.id = :id", { id: userId })
      .getMany();
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

  async updateStatus(status: UpdateTaskStatusDto, taskId: string): Promise<UpdateResult | boolean> {
    const task = await this.taskRepository.findOne(taskId);
    const newStatus = status.newStatus;

    if(task && this.taskFlowService.isAvailableNextStatus(task.status, newStatus)) {
      return await this.taskRepository.update(taskId, {
        status: newStatus,
        startedAt: (newStatus === TaskStatusType.inWork) ? DateHelper.formatToDbDateTime(new Date()) : task.startedAt,
        executedAt: (newStatus === TaskStatusType.completed) ? DateHelper.formatToDbDateTime(new Date()) : task.executedAt,
        updatedAt: DateHelper.formatToDbDateTime(new Date())
      })
    }

    return false;
  }
}
