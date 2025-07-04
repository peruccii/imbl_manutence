import { Module } from '@nestjs/common';
import { NotificationRepository } from '@application/repositories/notification-repository';
import { PrismaNotificationRepository } from '../prisma/repositories/prisma-notification-repository';
import { CreateNotificationService } from '@application/usecases/create-notification-service';
import { GetUserNotificationsService } from '@application/usecases/get-user-notifications-service';
import { MarkNotificationReadService } from '@application/usecases/mark-notification-read-service';
import { NotificationController } from '../../http/controllers/notification.controller';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
    CreateNotificationService,
    GetUserNotificationsService,
    MarkNotificationReadService,
  ],
  exports: [
    NotificationRepository,
    CreateNotificationService,
    GetUserNotificationsService,
    MarkNotificationReadService,
  ],
})
export class NotificationModule {}
