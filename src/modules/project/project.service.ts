import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectParticipantsDto } from './dto/project-participants.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiResponse } from '../../shared/helpers/api-response.helper';
import { ApiResponseHelper } from '../../shared/helpers/api-response.helper';

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

  async getAll(user: User): Promise<Project[]> {
    const query = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect("project.owner", "owner");

    if (!user.isAdmin) {
      query
        .leftJoin("project.participants", "participant")
        .where("participant.id = :userId", { userId: user.id });
    }

    return query.getMany();
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

  async create(project: CreateProjectDto, author: User): Promise<ApiResponse | HttpException> {
    try {
      const entity = await this.projectRepository.insert({...project, owner: author});
      return ApiResponseHelper.successActionResponse('Project successfully created', entity);
    } catch (err) {
      throw new HttpException("An error occurred while creating project", HttpStatus.BAD_REQUEST)
    }
  }

  async update(project: UpdateProjectDto, projectUuid: string): Promise<ApiResponse | HttpException> {
    try {
      const entity = await this.projectRepository.update(projectUuid, project);
      return ApiResponseHelper.successActionResponse('Project successfully updated', entity);
    } catch (err) {
      throw new HttpException("An error occurred while updating project", HttpStatus.BAD_REQUEST)
    }
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

  async addParticipant(projectParticipants: ProjectParticipantsDto, projectUuid: string): Promise<ApiResponse | HttpException> {
    const project = await this.projectRepository.findOne(projectUuid, {where: {isActive: true}});
    const participants = await this.userService.findUsersByIds(projectParticipants.userIds);

    if (!project || participants.length === 0) {
      throw new HttpException("Invalid request", HttpStatus.BAD_REQUEST);
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const participant of participants) {
        participant.projectParticipant.push(project);
        await queryRunner.manager.save(participant);
      }
      await queryRunner.commitTransaction();

      return ApiResponseHelper.successActionResponse('Participants successfully added');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException("An error occurred while adding participants", HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}
