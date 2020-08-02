import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm/index';
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

  beforeUpdate(event: InsertEvent<TaskComment>) {
    event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
  }
}