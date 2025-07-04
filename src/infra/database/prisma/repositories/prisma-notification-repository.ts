import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@application/repositories/notification-repository';
import { Notification, NotificationType } from '@application/entities/notification';
import { PrismaService } from '../prisma.service';
import { Pagination } from '@application/interfaces/pagination';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as any,
        isRead: notification.isRead,
        userId: notification.userId,
        manutenceId: notification.manutenceId,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      },
    });
  }

  async findByUserId(userId: string, pagination?: Pagination): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      skip: pagination?.skip,
      take: pagination?.limit,
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map(notification => 
      new Notification({
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationType,
        isRead: notification.isRead,
        userId: notification.userId,
        manutenceId: notification.manutenceId || undefined,
        createdAt: notification.createdAt,
        readAt: notification.readAt || undefined,
      }, notification.id)
    );
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { 
        userId,
        isRead: false 
      },
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map(notification => 
      new Notification({
        title: notification.title,
        message: notification.message,
        type: notification.type as NotificationType,
        isRead: notification.isRead,
        userId: notification.userId,
        manutenceId: notification.manutenceId || undefined,
        createdAt: notification.createdAt,
        readAt: notification.readAt || undefined,
      }, notification.id)
    );
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { 
        isRead: true,
        readAt: new Date()
      },
    });
  }

  async markAllAsReadByUserId(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { 
        userId,
        isRead: false 
      },
      data: { 
        isRead: true,
        readAt: new Date()
      },
    });
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return await this.prisma.notification.count({
      where: { 
        userId,
        isRead: false 
      },
    });
  }

  async delete(notificationId: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
