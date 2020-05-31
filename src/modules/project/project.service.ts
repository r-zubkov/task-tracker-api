import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ProjectParticipantsDto } from './project-participants.dto';

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
        id: id,
        isActive: true
      },
      relations: ['owner', 'participants'],
    });
  }

  async getAll(): Promise<Project[]> {
    return await this.projectRepository.find(
      {
        where: {
          isActive: true
        },
        relations: ['owner'],
      });
  }

  async create(project: Project): Promise<InsertResult> {
    return await this.projectRepository.insert({
      name: project.name,
      description: project.description,
      owner: project.owner,
    })
  }

  async update(project: Project): Promise<UpdateResult> {
    return await this.projectRepository.update(project.id, {
      name: project.name,
      description: project.description,
    })
  }

  async suspend(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({where: {id: id, isActive: true}});
    project.isActive = false;

    return await this.projectRepository.save(project);
  }

  async activate(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({where: {id: id, isActive: false}});
    project.isActive = true;

    return await this.projectRepository.save(project);
  }

  async addParticipant(projectParticipants: ProjectParticipantsDto): Promise<User[]> {
    const project = await this.projectRepository.findOne(projectParticipants.projectId);
    const participants = await this.userService.findUsersByIds(projectParticipants.userIds);

    for (const participant of participants) {
      participant.projectParticipant.push(project);
    }

    return this.userService.updateParticipantsState(participants);
  }
}
