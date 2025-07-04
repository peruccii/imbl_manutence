import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification-repository';
import { Notification, NotificationType } from '../entities/notification';
import { randomUUID } from 'crypto';

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  manutenceId?: string;
}

@Injectable()
export class CreateNotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(request: CreateNotificationRequest): Promise<void> {
    const notification = new Notification({
      title: request.title,
      message: request.message,
      type: request.type,
      isRead: false,
      userId: request.userId,
      manutenceId: request.manutenceId,
      createdAt: new Date(),
    }, randomUUID());

    await this.notificationRepository.create(notification);
  }
}
