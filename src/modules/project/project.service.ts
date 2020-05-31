import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectParticipantsDto } from './project-participants.dto';
import { CreateProjectDto } from './create-project.dto';
import { DateHelper } from '../../common/helpers/date.helper';
import { UpdateProjectDto } from './update-project.dto';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService
  ) {}

  async get(id: string): Promise<Project> {
    return await this.projectRepository.findOne({
      where: {
        id: id
      },
      relations: ['owner', 'participants', 'tasks', 'tasks.executor', 'tasks.checker', 'tasks.author'],
    });
  }

  async getAll(): Promise<Project[]> {
    return await this.projectRepository.find({
        relations: ['owner'],
      });
  }

  async getUserTasks(projectId: string, userId: string): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect("project.tasks", "task")
      .leftJoinAndSelect("task.executor", "executor")
      .leftJoinAndSelect("task.checker", "checker")
      .where("project.id = :id", { id: projectId })
      .orWhere("executor.id = :executorId", { executorId: userId })
      .orWhere("checker.id = :checkerId", { checkerId: userId })
      .getMany();
  }

  async create(project: CreateProjectDto): Promise<InsertResult> {
    return await this.projectRepository.insert({
      ...project,
      createdAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async update(project: UpdateProjectDto, projectId: string): Promise<UpdateResult> {
    return await this.projectRepository.update(projectId, {
      ...project,
      updatedAt: DateHelper.formatToDbDateTime(new Date())
    })
  }

  async suspend(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id: id,
        isActive: true
      }});
    project.isActive = false;

    return await this.projectRepository.save(project);
  }

  async activate(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id: id,
        isActive: false
      }});
    project.isActive = true;

    return await this.projectRepository.save(project);
  }

  async addParticipant(projectParticipants: ProjectParticipantsDto, projectId: string): Promise<User[]> {
    const project = await this.projectRepository.findOne(projectId);
    const participants = await this.userService.findUsersByIds(projectParticipants.userIds);

    for (const participant of participants) {
      participant.projectParticipant.push(project);
    }

    return this.userService.updateParticipantsState(participants);
  }
}
