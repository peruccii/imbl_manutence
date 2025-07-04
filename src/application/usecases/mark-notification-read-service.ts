import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification-repository';

export interface MarkNotificationReadRequest {
  notificationId?: string;
  userId?: string;
  markAll?: boolean;
}

@Injectable()
export class MarkNotificationReadService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(request: MarkNotificationReadRequest): Promise<void> {
    const { notificationId, userId, markAll } = request;

    if (markAll && userId) {
      await this.notificationRepository.markAllAsReadByUserId(userId);
    } else if (notificationId) {
      await this.notificationRepository.markAsRead(notificationId);
    } else {
      throw new Error('Either notificationId or userId (with markAll=true) must be provided');
    }
  }
}
