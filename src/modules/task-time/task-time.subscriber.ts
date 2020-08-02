import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm/index';
import { DateHelper } from '../../shared/helpers/date.helper';
import { TaskTime } from './task-time.entity';

@EventSubscriber()
export class TaskTimeSubscriber implements EntitySubscriberInterface<TaskTime> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return TaskTime;
  }

  beforeInsert(event: InsertEvent<TaskTime>) {
    event.entity.createdAt = DateHelper.formatToDbDateTime(new Date());
  }

  beforeUpdate(event: InsertEvent<TaskTime>) {
    event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
  }
}