import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { DateHelper } from '../../shared/helpers/date.helper';
import { Task } from './task.entity';

@EventSubscriber()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Task;
  }

  beforeInsert(event: InsertEvent<Task>) {
    event.entity.createdAt = DateHelper.formatToDbDateTime(new Date());
  }

  beforeUpdate(event: UpdateEvent<Task>) {
    if (event.entity) {
      event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
    }
  }
}
