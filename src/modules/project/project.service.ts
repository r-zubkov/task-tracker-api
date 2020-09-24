import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectParticipantsDto } from './dto/project-participants.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
    private connection: Connection,
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

  async create(project: CreateProjectDto, author: User): Promise<InsertResult> {
    return await this.projectRepository.insert({...project, owner: author});
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

  async addParticipant(projectParticipants: ProjectParticipantsDto, projectUuid: string): Promise<any> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const project = await this.projectRepository.findOne(projectUuid);
    const participants = await this.userService.findUsersByIds(projectParticipants.userIds);

    try {
      for (const participant of participants) {
        await queryRunner.manager.save({
          ...participant,
          projectParticipant: participant.projectParticipant.push(project)
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    }
  }
}
