import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectParticipantsDto } from './dto/project-participants.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiActionResponse,
  ApiEntityResponse,
  ApiListResponse,
} from '../../shared/helpers/api-response.helper';
import { ApiResponseHelper } from '../../shared/helpers/api-response.helper';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
    private connection: Connection,
  ) {}

  private _buildProjectQuery(uuid: string | null = null, user: User | null = null): SelectQueryBuilder<Project> {
    const query = this.projectRepository.createQueryBuilder('project');

    if (uuid) {
      query.where("project.id = :id", { id: uuid });
    }

    // for non-admin, return only the active project, and the project where the user is a participant
    if (user && !user.isAdmin) {
      query
        .leftJoin("project.participants", "participant")
        .andWhere("project.isActive = :isActive", { isActive: true })
        .andWhere("participant.id = :userId", { userId: user.id });
    }

    return query
      .leftJoinAndMapOne("project.owner", "project.owner", "owner");
  }

  async getAll(user: User): Promise<ApiListResponse<Project>> {
    const query = this._buildProjectQuery(null, user);

    const result = await query
      .orderBy('project.created_at', 'DESC')
      .getMany();
    return ApiResponseHelper.list(result);
  }

  async get(uuid: string, user: User): Promise<ApiEntityResponse<Project> | HttpException> {
    const entity = await (this._buildProjectQuery(uuid, user)).getOne();

    if (!entity) {
      throw new HttpException("Project not found", HttpStatus.NOT_FOUND)
    }

    return ApiResponseHelper.entity(entity);
  }

  async create(project: CreateProjectDto, author: User): Promise<ApiActionResponse | HttpException> {
    try {
      const entity = await this.projectRepository.insert({...project, owner: author});
      return ApiResponseHelper.successAction('Project successfully created', entity);
    } catch (err) {
      throw new HttpException("An error occurred while creating project", HttpStatus.BAD_REQUEST)
    }
  }

  async update(project: UpdateProjectDto, projectUuid: string): Promise<ApiActionResponse | HttpException> {
    try {
      const entity = await this.projectRepository.update(projectUuid, project);
      return ApiResponseHelper.successAction('Project successfully updated', entity);
    } catch (err) {
      throw new HttpException("An error occurred while updating project", HttpStatus.BAD_REQUEST)
    }
  }

  private async _updateStatus(
    uuid: string,
    newStatus: boolean,
    completedText: string,
    progressingText: string,
  ): Promise<ApiActionResponse | HttpException> {
    const entity: Project = await this.projectRepository.findOne({
      where: {
        id: uuid,
        isActive: !newStatus
      }});

    if (!entity) {
      throw new HttpException("Invalid request", HttpStatus.BAD_REQUEST)
    }

    try {
      entity.isActive = newStatus;
      const result = await this.projectRepository.update(uuid, entity);
      return ApiResponseHelper.successAction(`Project successfully ${completedText}`, result);
    } catch (err) {
      throw new HttpException(`An error occurred while ${progressingText} project`, HttpStatus.BAD_REQUEST)
    }
  }

  async suspend(uuid: string): Promise<ApiActionResponse | HttpException> {
    return this._updateStatus(uuid, false, 'suspended', 'suspending');
  }

  async activate(uuid: string): Promise<ApiActionResponse | HttpException> {
    return this._updateStatus(uuid, true, 'activated', 'activating');
  }

  async addParticipant(projectParticipants: ProjectParticipantsDto, projectUuid: string): Promise<ApiActionResponse | HttpException> {
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
      return ApiResponseHelper.successAction('Participants successfully added');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException("An error occurred while adding participants", HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}
