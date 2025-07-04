import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from '@application/guards/role.guards';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/application/enums/role.enum';
import { UserId } from '@application/utils/extract-user-id';
import { GetUserNotificationsService } from '@application/usecases/get-user-notifications-service';
import { MarkNotificationReadService } from '@application/usecases/mark-notification-read-service';
import { PaginationDto } from '../dto/pagination-dto';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly getUserNotificationsService: GetUserNotificationsService,
    private readonly markNotificationReadService: MarkNotificationReadService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getUserNotifications(
    @UserId() userId: string,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto,
  ) {
    const result = await this.getUserNotificationsService.execute({
      userId,
      pagination,
    });

    return {
      data: result.notifications.map(notification => notification.toJSON()),
      unreadCount: result.unreadCount,
      pagination: {
        page: Math.floor(Number(pagination.skip) / Number(pagination.limit)) + 1,
        limit: Number(pagination.limit),
        total: result.notifications.length,
      }
    };
  }

  @Get('unread')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getUnreadNotifications(@UserId() userId: string) {
    const result = await this.getUserNotificationsService.execute({
      userId,
      unreadOnly: true,
    });

    return {
      data: result.notifications.map(notification => notification.toJSON()),
      unreadCount: result.unreadCount,
    };
  }

  @Get('unread-count')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getUnreadCount(@UserId() userId: string) {
    const result = await this.getUserNotificationsService.execute({
      userId,
      unreadOnly: true,
    });

    return { unreadCount: result.unreadCount };
  }

  @Post('mark-read/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async markAsRead(@Param('id') notificationId: string) {
    await this.markNotificationReadService.execute({ notificationId });
    return { success: true };
  }

  @Post('mark-all-read')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async markAllAsRead(@UserId() userId: string) {
    await this.markNotificationReadService.execute({ 
      userId, 
      markAll: true 
    });
    return { success: true };
  }

  @Get('manutences')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getMaintenanceNotifications(
    @UserId() userId: string,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto,
  ) {
    const result = await this.getUserNotificationsService.execute({
      userId,
      pagination,
    });

    // Filtrar apenas notificações relacionadas a manutenções
    const maintenanceNotifications = result.notifications.filter(
      notification => notification.manutenceId !== undefined
    );

    return {
      data: maintenanceNotifications.map(notification => notification.toJSON()),
      unreadCount: result.unreadCount,
      pagination: {
        page: Math.floor(Number(pagination.skip) / Number(pagination.limit)) + 1,
        limit: Number(pagination.limit),
        total: maintenanceNotifications.length,
      }
    };
  }
}
