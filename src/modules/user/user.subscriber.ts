import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm/index';
import { User } from './user.entity';
import { DateHelper } from '../../shared/helpers/date.helper';
import * as bcrypt from 'bcryptjs';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.createdAt = DateHelper.formatToDbDateTime(new Date());
    event.entity.password = await bcrypt.hash(event.entity.password, 10);
  }

  beforeUpdate(event: InsertEvent<User>) {
    event.entity.updatedAt = DateHelper.formatToDbDateTime(new Date());
  }
}