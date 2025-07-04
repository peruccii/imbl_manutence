import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification-repository';
import { Notification } from '../entities/notification';
import { Pagination } from '../interfaces/pagination';

export interface GetUserNotificationsRequest {
  userId: string;
  pagination?: Pagination;
  unreadOnly?: boolean;
}

@Injectable()
export class GetUserNotificationsService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(request: GetUserNotificationsRequest): Promise<{
    notifications: Notification[];
    unreadCount: number;
  }> {
    const { userId, pagination, unreadOnly } = request;

    const notifications = unreadOnly 
      ? await this.notificationRepository.findUnreadByUserId(userId)
      : await this.notificationRepository.findByUserId(userId, pagination);

    const unreadCount = await this.notificationRepository.countUnreadByUserId(userId);

    return {
      notifications,
      unreadCount,
    };
  }
}
