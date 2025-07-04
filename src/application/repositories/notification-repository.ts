import { Notification } from '../entities/notification';
import { Pagination } from '../interfaces/pagination';

export abstract class NotificationRepository {
  abstract create(notification: Notification): Promise<void>;
  abstract findByUserId(userId: string, pagination?: Pagination): Promise<Notification[]>;
  abstract findUnreadByUserId(userId: string): Promise<Notification[]>;
  abstract markAsRead(notificationId: string): Promise<void>;
  abstract markAllAsReadByUserId(userId: string): Promise<void>;
  abstract countUnreadByUserId(userId: string): Promise<number>;
  abstract delete(notificationId: string): Promise<void>;
}
