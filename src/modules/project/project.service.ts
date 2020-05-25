import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async get(id: string): Promise<Project> {
    return await this.projectRepository.findOne({
      where: {
        id: id,
        isActive: true
      },
      relations: ['owner'],
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
}
