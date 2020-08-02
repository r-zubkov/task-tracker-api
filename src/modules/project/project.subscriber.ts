import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm/index';
import { DateHelper } from '../../shared/helpers/date.helper';
import { Project } from './project.entity';

@EventSubscriber()
export class ProjectSubscriber implements EntitySubscriberInterface<Project> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Project;
  }

  beforeInsert(event: InsertEvent<Project>) {
    event.entity.createdAt = DateHelper.formatToDbDateTime(new Date());
  }

  beforeUpdate(event: InsertEvent<Project>) {
    event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
  }
}