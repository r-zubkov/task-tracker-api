import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectParticipantsDto } from './dto/project-participants.dto';
import { ApiActionResponse, ApiListResponse, ApiResponseHelper } from '../../shared/helpers/api-response.helper';
import { Project } from '../project/project.entity';
import { UserService } from '../user/user.service';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectParticipant } from './project-participant.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ParticipantService {

  constructor(
    @InjectRepository(ProjectParticipant)
    private participantRepository: Repository<ProjectParticipant>,
    private userService: UserService,
    private connection: Connection,
  ) {}

  async getAll(project: Project): Promise<ApiListResponse<Project>> {
    const result = await this.participantRepository
      .createQueryBuilder('projectParticipant')
      .select(['user.id as id', 'user.first_name as firstName', 'user.last_name as lastName'])
      .leftJoin('projectParticipant.user', 'user')
      .where('projectParticipant.project_id = :projectId', { projectId: project.id })
      .andWhere('projectParticipant.is_active = :isActive', { isActive: true })
      .andWhere('user.is_active = :isActive', { isActive: true })
      .getRawMany();

    return ApiResponseHelper.list(result)
  }

  private _buildParticipantQuery(project: Project, user: User): SelectQueryBuilder<ProjectParticipant> {
    return this.participantRepository
      .createQueryBuilder('projectParticipant')
      .where('projectParticipant.project_id = :projectId', { projectId: project.id })
      .andWhere('projectParticipant.user_id = :userId', { userId: user.id })
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user');
  }

  private async _updateParticipants (
    projectParticipants: ProjectParticipantsDto,
    project: Project,
    successAction: string,
    progressAction: string,
    callback
  ): Promise< ApiActionResponse | HttpException> {
    const participants = await this.userService.findUsersByIds(projectParticipants.userIds);

    if (!project || participants.length === 0) {
      throw new HttpException("Invalid request", HttpStatus.BAD_REQUEST);
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const participant of participants) {
        const entity = await (this._buildParticipantQuery(project, participant)).getOne();
        const callbackResult = callback(entity, participant)

        if (callbackResult) {
          await queryRunner.manager.save(callbackResult);
        }
      }
      await queryRunner.commitTransaction();
      return ApiResponseHelper.successAction(`Participants successfully ${successAction}`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(`An error occurred while ${progressAction} participants`, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async addParticipants(
    projectParticipants: ProjectParticipantsDto,
    project: Project
  ): Promise< ApiActionResponse | HttpException> {
    return this._updateParticipants(
      projectParticipants,
      project,
      'added',
      'adding',
      (entity, participant) => {
      if (entity) {
        if (entity.isActiveParticipant) {
          return null;
        } else {
          entity.isActive = true;
        }
      } else {
        entity = new ProjectParticipant();
        entity.user = participant;
        entity.project = project;
      }
      return entity;
    });
  }

  async deleteParticipants(
    projectParticipants: ProjectParticipantsDto,
    project: Project
  ): Promise< ApiActionResponse | HttpException> {
    return this._updateParticipants(
      projectParticipants,
      project,
      'deleted',
      'deleting',
      (entity, participant) => {
        if (!entity || !entity.isActiveParticipant) {
          return null;
        } else {
          entity.isActive = false;
        }
        return entity;
      });
  }

}
