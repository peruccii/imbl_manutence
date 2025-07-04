import { Injectable } from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { StatusManutence } from '../enums/StatusManutence';
import { NotFoundErrorHandler } from '../errors/not-found-error.error';
import { ManutenceNotFoundMessage } from '../messages/manutence-not-found';
import { randomUUID } from 'crypto';
import { ActionHistory } from '../enums/action.enum';
import { HistoryManutenceRepository } from '../repositories/history-manutence-repository';
import { CreateNotificationService } from './create-notification-service';
import { NotificationType } from '../entities/notification';

interface AcceptManutenceRequest {
  manutenceId: string;
  adminId: string;
}

@Injectable()
export class AcceptManutenceService {
  constructor(
    private manutenceRepository: ManutenceRepository,
    private historyManutenceRepository: HistoryManutenceRepository,
    private createNotificationService: CreateNotificationService,
  ) {}

  async execute({ manutenceId, adminId }: AcceptManutenceRequest) {
    const manutence = await this.manutenceRepository.find(manutenceId);

    if (!manutence) {
      throw new NotFoundErrorHandler(ManutenceNotFoundMessage);
    }

    if (manutence.chatRoomId) {
      await this.manutenceRepository.updateChatRoom(
        manutence.chatRoomId,
        adminId,
      );
    }

    const manutencaoHistoryObject = {
      title: manutence.title,
      address: manutence.address,
      status_manutence: manutence.status_manutence,
      createdAt: manutence.createdAt,
      message: manutence.message.value,
      photos: manutence.photos,
    };

    await this.historyManutenceRepository.createHistoryEntry({
      id: randomUUID(),
      action: ActionHistory.MANUTENCE_ACCEPTED,
      data: new Date(),
      usuarioId: adminId,
      manutenceId: manutenceId,
      manutencao: manutencaoHistoryObject,
    });

    this.manutenceRepository.update(manutenceId, {
      status_manutence: StatusManutence.ANDAMENTO,
      adminId: adminId,
    });

    // Criar notificação para o cliente
    await this.createNotificationService.execute({
      title: 'Manutenção Aceita',
      message: `Sua manutenção "${manutence.title}" foi aceita e está em andamento.`,
      type: NotificationType.SUCCESS,
      userId: manutence.userId,
      manutenceId: manutenceId,
    });

    return { success: true };
  }
}
