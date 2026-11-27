import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { DateHelper } from '../../shared/helpers/date.helper';
import { TaskComment } from './task-comment.entity';

@EventSubscriber()
export class TaskCommentSubscriber implements EntitySubscriberInterface<TaskComment> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return TaskComment;
  }

  beforeInsert(event: InsertEvent<TaskComment>) {
    event.entity.createdAt = DateHelper.formatToDbDateTime(new Date());
  }

  beforeUpdate(event: UpdateEvent<TaskComment>) {
    if (event.entity) {
      event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
    }
  }
}
