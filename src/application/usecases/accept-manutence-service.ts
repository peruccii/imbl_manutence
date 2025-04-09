import { Injectable } from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { StatusManutence } from '../enums/StatusManutence';
import { NotFoundErrorHandler } from '../errors/not-found-error.error';
import { ManutenceNotFoundMessage } from '../messages/manutence-not-found';
import { randomUUID } from 'crypto';
import { ActionHistory } from '../enums/action.enum';
import { HistoryManutenceRepository } from '../repositories/history-manutence-repository';

interface AcceptManutenceRequest {
  manutenceId: string;
  adminId: string;
}

@Injectable()
export class AcceptManutenceService {
  constructor(
    private manutenceRepository: ManutenceRepository,
    private historyManutenceRepository: HistoryManutenceRepository,
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

    await this.manutenceRepository.update(manutenceId, {
      status_manutence: StatusManutence.ANDAMENTO,
      adminId: adminId,
    });

    return { success: true };
  }
}
