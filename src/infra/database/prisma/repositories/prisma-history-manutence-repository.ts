import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HistoryManutenceRepository } from '@application/repositories/history-manutence-repository';
import { ActionHistory } from '@application/enums/action.enum';

@Injectable()
export class PrismaHistoryManutenceRepository implements HistoryManutenceRepository {
  constructor(private prisma: PrismaService) {}

  async createHistoryEntry(data: {
    id: string;
    action: ActionHistory;
    data: Date;
    usuarioId: string;
    manutenceId: string;
  }): Promise<void> {
    await this.prisma.historicoManutencao.create({
      data: {
        id: data.id,
        action: data.action,
        data: data.data,
        usuarioId: data.usuarioId,
        manutenceId: data.manutenceId
      }
    });
  }
} 