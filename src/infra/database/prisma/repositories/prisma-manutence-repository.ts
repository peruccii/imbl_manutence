import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ManutenceRepository } from 'src/application/repositories/manutence-repository';
import { Manutence } from 'src/application/entities/manutence';
import { PrismaManutenceMapper } from '../mappers/prisma-manutence-mapper';
import { Pagination } from '@application/interfaces/pagination';
import { FiltersManutence } from '@application/interfaces/filters-manutence';
import { PrismaHistoryManutenceMapper } from '../mappers/prisma-history-manutence-mapper';
import { ActionHistory } from '@application/enums/action.enum';
import { RequestContext } from '@application/utils/request-context';
import { StatusManutence } from '@application/enums/StatusManutence';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { PrismaCreateRoomMapper } from '../mappers/prisma-create-room-mapper';
import { CreateChatRoomRequest } from '@application/interfaces/create-room';
import { ManutenceNotFoundMessage } from '@application/messages/manutence-not-found';
import { RoomUser } from '@application/interfaces/room-users-interface';
import { UpdateManutenceData } from '@application/repositories/manutence-repository';
import { randomUUID } from 'crypto';

@Injectable()
export class PrismaManutenceRepository implements ManutenceRepository {
  constructor(
    private requestContext: RequestContext,
    private prisma: PrismaService,
  ) {}

  async findByFilters(
    filters: FiltersManutence,
    pagination: Pagination,
  ): Promise<{ manutences: Manutence[] | []; total: number }> {
    const statusFilter = filters?.status_manutence
      ? Array.isArray(filters.status_manutence)
        ? filters.status_manutence
        : [filters.status_manutence]
      : undefined;

    const whereClause: any = {
      status_manutence: statusFilter ? { in: statusFilter } : undefined,
    };

    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

  const paginationToUse = pagination || { skip: 0, limit: 10 };

    const [manutences, total] = await this.prisma.$transaction([
      this.prisma.manutence.findMany({
        skip: paginationToUse.skip,
        take: Number(paginationToUse.limit),
        where: whereClause,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.manutence.count({
        where: whereClause,
      }),
    ]);

    return {
      manutences: manutences.map((manutence) => {
        return PrismaManutenceMapper.toDomain(manutence);
      }),
      total,
    };
  }

  async update(id: string, data: UpdateManutenceData): Promise<void> {
    const manutence = await this.find(id);
    if (!manutence) {
      throw new NotFoundErrorHandler(ManutenceNotFoundMessage);
    }

    await this.prisma.manutence.update({
      where: { id },
      data: {
        status_manutence: data.status_manutence,
        adminId: data.adminId,
        chatRoomId: data.chatRoomId,
        priority: data.priority,
      },
    });
  }

  async findByAdminId(adminId: string): Promise<Manutence[] | []> {
    const manutences = await this.prisma.manutence.findMany({
      where: { adminId },
    });
    return manutences.map((manutence) => {
      return PrismaManutenceMapper.toDomain(manutence);
    });
  }

  async find(id: string): Promise<Manutence | null> {
    const manutence = await this.prisma.manutence.findUnique({
      where: { id: id },
      include: {
        user: true,
      },
    });

    if (!manutence) throw new NotFoundErrorHandler(ManutenceNotFoundMessage);

    return PrismaManutenceMapper.toDomain(manutence);
  }

  async create(manutence: Manutence): Promise<void> {
    console.log(manutence);
    const raw = PrismaManutenceMapper.toPrisma(manutence);
    await this.prisma.$transaction(async (prisma) => {
      const createdManutence = await prisma.manutence.create({
        data: raw,
      });

      const manutencee = await prisma.manutence.findUnique({
        where: { id: createdManutence.id },
        include: { user: true },
      });

      if (!manutencee) throw new NotFoundErrorHandler(ManutenceNotFoundMessage);

      const RoomUserObject: RoomUser = {
        id: manutencee.user.id,
        email: manutencee.user.email,
        name: manutencee.user.name,
      };

      const createRoomRequest: CreateChatRoomRequest = {
        id: createdManutence.id,
        name: manutencee.title,
        users: [RoomUserObject],
        messages: [],
      };

      const chatRoomData = PrismaCreateRoomMapper.toPrisma(createRoomRequest);

      const createdChatRoom = await prisma.chatRoom.create({
        data: {
          ...chatRoomData,
          id: createdManutence.id,
          manutence: { connect: { id: createdManutence.id } },
        },
      });

      await prisma.manutence.update({
        where: { id: createdManutence.id },
        data: { chatRoomId: createdChatRoom.id },
      });

      const manutencaoHistoryObject = {
        title: manutence.title,
        address: manutence.address,
        status_manutence: manutence.status_manutence,
        createdAt: manutence.createdAt,
        message: manutence.message.value,
        photos: manutence.photos,
      };

      const rawManutenceHistory = PrismaHistoryManutenceMapper.toPrisma(
        ActionHistory.MANUTENCE_CREATED,
        manutence.createdAt,
        createdManutence.userId,
        createdManutence.id,
        manutencaoHistoryObject,
      );

      await prisma.historicoManutencao.create({
        data: rawManutenceHistory,
      });
      console.log(`manutence created: ${createdManutence.id}`);
    });
  }

  async delete(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      const manutence = await prisma.manutence.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!manutence) {
        throw new NotFoundErrorHandler(ManutenceNotFoundMessage);
      }

      const manutencaoHistoryObject = {
        title: manutence.title,
        address: manutence.address,
        status_manutence: manutence.status_manutence,
        createdAt: manutence.createdAt,
        message: manutence.message,
        photos: manutence.photos,
      };

      await prisma.historicoManutencao.create({
        data: {
          id: randomUUID(),
          action: ActionHistory.MANUTENCE_DELETED,
          data: new Date(),
          usuarioId: manutence.userId,
          manutenceId: manutence.id,
          manutencao: manutencaoHistoryObject,
        },
      });

      if (manutence.chatRoomId) {
        await prisma.message.deleteMany({
          where: { chatRoomId: manutence.chatRoomId },
        });
        await prisma.chatRoom.delete({
          where: { id: manutence.chatRoomId },
        });
      }

      await prisma.manutence.delete({
        where: { id },
      });
    });
  }

  async findMany(pagination: Pagination): Promise<Manutence[] | []> {
    const manutences = await this.prisma.manutence.findMany({
      skip: pagination.skip,
      take: Number(pagination.limit),
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return manutences.map((manutence) => {
      return PrismaManutenceMapper.toDomain(manutence);
    });
  }

  async countNewManutences(status_manutence: StatusManutence): Promise<number> {
    const count = await this.prisma.manutence.count({
      where: { status_manutence: status_manutence },
    });
    return count;
  }

  async updateChatRoom(chatRoomId: string, adminId: string): Promise<void> {
    await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        users: {
          connect: { id: adminId },
        },
      },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.manutence.count();
  }
}
