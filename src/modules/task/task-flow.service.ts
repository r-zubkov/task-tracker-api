import { Injectable } from '@nestjs/common';
import { TaskStatusType } from './task.entity';

@Injectable()
export class TaskFlowService {
  getNextTaskStatus = (currentTaskStatus: string): string[] => {
    switch (currentTaskStatus) {
      case 'new': {
        return [
          TaskStatusType.inWork,
          TaskStatusType.rejected,
          TaskStatusType.delayed
        ];
      }

      case 'in_work': {
        return [
          TaskStatusType.completed,
          TaskStatusType.delayed
        ];
      }

      case 'completed': {
        return [
          TaskStatusType.returned,
        ];
      }

      case 'delayed': {
        return [
          TaskStatusType.inWork,
          TaskStatusType.rejected
        ];
      }

      case 'returned': {
        return [
          TaskStatusType.inWork,
          TaskStatusType.rejected
        ];
      }

      case 'rejected': {
        return [];
      }
    }
  }

  isAvailableNextStatus(currentTaskStatus: string, newTaskStatus: string): boolean {
    return this.getNextTaskStatus(currentTaskStatus).includes(newTaskStatus)
  }
}
