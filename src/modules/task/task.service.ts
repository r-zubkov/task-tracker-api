import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult, SelectQueryBuilder } from 'typeorm';
import { Task, TaskStatusType } from './task.entity';
import { DateHelper } from '../../shared/helpers/date.helper';
import { CreateUpdateTaskDto } from './dto/create-update-task.dto';
import { TaskFlowService } from './task-flow.service';
import { CrudService } from '../../core/services/crud.service';
import { User } from '../user/user.entity';
import { Crud } from '../../core/interfaces/crud.interface';
import { ApiActionResponse, ApiEntityResponse, ApiListResponse } from '../../shared/helpers/api-response.helper';
import { Project } from '../project/project.entity';

@Injectable()
export class TaskService extends CrudService<Task> implements Crud<Task>{

  protected readonly entityAlias = 'task';

  constructor(
    @InjectRepository(Task)
    repository: Repository<Task>,
    private taskFlowService: TaskFlowService
  ) {
    super(repository)
  }

  protected _buildQuery(user: User, uuid?: string): SelectQueryBuilder<Task> {
    const query = this.repository.createQueryBuilder(this.entityAlias);

    if (uuid) {
      query.where(`${this.entityAlias}.id = :id`, { id: uuid });
    }

    // for non-admin, return only the task, when user is participant (author/executor/checker)
    if (!user.isAdmin) {
      query
        .orWhere(`${this.entityAlias}.executor = :executorId`, { executorId: user.id })
        .orWhere(`${this.entityAlias}.checker = :checkerId`, { checkerId: user.id })
        .orWhere(`${this.entityAlias}.author = :authorId`, { authorId: user.id });
    }

    return query
      .leftJoinAndSelect(`${this.entityAlias}.executor`, "executor")
      .leftJoinAndSelect(`${this.entityAlias}.checker`, "checker")
      .leftJoinAndSelect(`${this.entityAlias}.author`, "author");
  }

  async getAll(user: User): Promise<ApiListResponse<Task>> {
    return this.getEntityList(user);
  }

  async get(user: User, uuid: string): Promise<ApiEntityResponse<Task> | HttpException> {
    return this.getEntity(user, uuid);
  }

  async create(user: User, project: Project, task: CreateUpdateTaskDto): Promise<ApiActionResponse | HttpException> {
    return this.createEntity({...task, author: user, project: project});
  }

  update(user: User, task: CreateUpdateTaskDto, uuid: string): Promise<ApiActionResponse | HttpException> {
    return this.updateEntity('', '')
  }

  // TODO
  // async getUserTasks(projectUuid: string, userUuid: string): Promise<Project[]> {
  //   return await this.projectRepository
  //     .createQueryBuilder('project')
  //     .leftJoinAndSelect("project.tasks", "task")
  //     .leftJoinAndSelect("task.executor", "executor")
  //     .leftJoinAndSelect("task.checker", "checker")
  //     .where("project.id = :id", { id: projectUuid })
  //     .orWhere("executor.id = :executorId", { executorId: userUuid })
  //     .orWhere("checker.id = :checkerId", { checkerId: userUuid })
  //     .getMany();
  // }

  async getUserTrackedTime(userUuid: string): Promise<Task[]> {
    return await this.repository
      .createQueryBuilder('task')
      .leftJoinAndSelect("task.taskTrackedTime", "taskTrackedTime")
      .leftJoinAndSelect("task.project", "project")
      .leftJoinAndSelect("taskTrackedTime.author", "author")
      .where("author.id = :id", { id: userUuid })
      .getMany();
  }

  // async update(task: UpdateTaskDto, projectUuid: string): Promise<UpdateResult> {
  //   return await this.repository.update(projectUuid, task)
  // }

  // async updateStatus(status: UpdateTaskStatusDto, taskUuid: string): Promise<UpdateResult | boolean> {
  //   const task = await this.repository.findOne(taskUuid);
  //   const newStatus = status.newStatus;
  //
  //   if(task && this.taskFlowService.isAvailableNextStatus(task.status, newStatus)) {
  //     return await this.repository.update(taskUuid, {
  //       status: newStatus,
  //       startedAt: (newStatus === TaskStatusType.inWork) ? DateHelper.formatToDbDateTime(new Date()) : task.startedAt,
  //       executedAt: (newStatus === TaskStatusType.completed) ? DateHelper.formatToDbDateTime(new Date()) : task.executedAt
  //     })
  //   }
  //
  //   return false;
  // }
}
