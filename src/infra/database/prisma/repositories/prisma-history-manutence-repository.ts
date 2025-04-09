import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HistoryManutenceRepository } from '@application/repositories/history-manutence-repository';
import { ActionHistory } from '@application/enums/action.enum';
import { HistoryManutence } from '@application/entities/history_manutence';
import { Pagination } from '@application/interfaces/pagination';
import { randomUUID } from 'crypto';
import { User } from '@application/entities/user';
import { Manutence } from '@application/entities/manutence';
import { Role } from '@application/enums/role.enum';
import { Email } from '@application/fieldsValidations/email';
import { Name } from '@application/fieldsValidations/name';
import { Telefone } from '@application/fieldsValidations/telefone';
import { Password } from '@application/fieldsValidations/password';
import { Message } from '@application/fieldsValidations/message';
import { StatusManutence } from '@application/enums/StatusManutence';
import { HistoricoManutencao } from '@prisma/client';

@Injectable()
export class PrismaHistoryManutenceRepository
  implements HistoryManutenceRepository
{
  constructor(private prisma: PrismaService) {}

  private mapToHistoryManutence(
    history: HistoricoManutencao & {
      usuario: any;
      manutencao: any;
    },
  ): HistoryManutence {
    return new HistoryManutence(
      {
        data: history.data,
        usuarioId: history.usuarioId,
        action: history.action as ActionHistory,
        usuario: new User(
          {
            email: new Email(history.usuario.email),
            name: new Name(history.usuario.name),
            telephone: new Telefone(history.usuario.telephone),
            createdAt: history.usuario.createdAt,
            typeUser: history.usuario.typeUser as Role,
            manutences: [],
            password: new Password(history.usuario.password),
          },
          history.usuario.id,
        ),
        manutencao: {
          message: history.manutencao.message,
          photos: Array.isArray(history.manutencao.photos)
            ? history.manutencao.photos.map((photo: any) => ({
                fileName: photo.fileName,
                signedUrl: photo.signedUrl,
              }))
            : [],
          title: history.manutencao.title,
          address: history.manutencao.address,
          status_manutence: history.manutencao
            .status_manutence as StatusManutence,
          createdAt: history.manutencao.createdAt,
        },
        typeUser: history.usuario.typeUser as Role,
        occurredAt: history.data,
      },
      history.id,
    );
  }

  async findMany(pagination: Pagination): Promise<HistoryManutence[]> {
    const histories = await this.prisma.historicoManutencao.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: {
        data: 'desc',
      },
      include: {
        usuario: true,
      },
    });

    return histories
      .filter((history) => history.manutencao !== null)
      .map((history) => this.mapToHistoryManutence(history));
  }

  async findByManutenceId(
    manutenceId: string,
    pagination: Pagination,
  ): Promise<HistoryManutence[]> {
    const histories = await this.prisma.historicoManutencao.findMany({
      where: {
        manutenceId,
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: {
        data: 'desc',
      },
      include: {
        usuario: true,
      },
    });

    return histories
      .filter((history) => history.manutencao !== null)
      .map((history) => this.mapToHistoryManutence(history));
  }

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
        manutenceId: data.manutenceId,
      },
    });
  }
}
