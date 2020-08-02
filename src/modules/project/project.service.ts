import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectParticipantsDto } from './project-participants.dto';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService
  ) {}

  async get(uuid: string): Promise<Project> {
    return await this.projectRepository.findOne({
      where: {
        id: uuid
      },
      relations: ['owner', 'participants', 'tasks', 'tasks.executor', 'tasks.checker', 'tasks.author'],
    });
  }

  async getAll(): Promise<Project[]> {
    return await this.projectRepository.find({
        relations: ['owner'],
      });
  }

  async getUserTasks(projectUuid: string, userUuid: string): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect("project.tasks", "task")
      .leftJoinAndSelect("task.executor", "executor")
      .leftJoinAndSelect("task.checker", "checker")
      .where("project.id = :id", { id: projectUuid })
      .orWhere("executor.id = :executorId", { executorId: userUuid })
      .orWhere("checker.id = :checkerId", { checkerId: userUuid })
      .getMany();
  }

  async create(project: CreateProjectDto): Promise<InsertResult> {
    return await this.projectRepository.insert(project);
  }

  async update(project: UpdateProjectDto, projectUuid: string): Promise<UpdateResult> {
    return await this.projectRepository.update(projectUuid, project)
  }

  async suspend(uuid: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id: uuid,
        isActive: true
      }});
    project.isActive = false;

    return await this.projectRepository.save(project);
  }

  async activate(uuid: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id: uuid,
        isActive: false
      }});
    project.isActive = true;

    return await this.projectRepository.save(project);
  }

  async addParticipant(projectParticipants: ProjectParticipantsDto, projectUuid: string): Promise<User[]> {
    const project = await this.projectRepository.findOne(projectUuid);
    const participants = await this.userService.findUsersByIds(projectParticipants.userIds);

    for (const participant of participants) {
      participant.projectParticipant.push(project);
    }

    return this.userService.updateParticipantsState(participants);
  }
}
