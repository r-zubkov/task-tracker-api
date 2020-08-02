import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm/index';
import { DateHelper } from '../../shared/helpers/date.helper';
import { Task } from './task.entity';

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Task;
  }

  beforeInsert(event: InsertEvent<Task>) {
    event.entity.createdAt = DateHelper.formatToDbDateTime(new Date());
  }

  beforeUpdate(event: InsertEvent<Task>) {
    event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
  }
}