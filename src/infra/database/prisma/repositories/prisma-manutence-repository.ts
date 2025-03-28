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

@Injectable()
export class PrismaManutenceRepository implements ManutenceRepository {
  constructor(
    private requestContext: RequestContext,
    private prisma: PrismaService,
  ) {}

  async findByFilters(
    filters: FiltersManutence,
    pagination: Pagination,
  ): Promise<Manutence[] | []> {
    const statusFilter = filters?.status_manutence
      ? Array.isArray(filters.status_manutence)
        ? filters.status_manutence
        : [filters.status_manutence]
      : undefined;
    const manutences = await this.prisma.manutence.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      where: {
        status_manutence: statusFilter ? { in: statusFilter } : undefined,
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return manutences.map((manutence) => {
      return PrismaManutenceMapper.toDomain(manutence);
    });
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
      },
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
        name: manutencee.title,
        users: [RoomUserObject],
        messages: [],
      };

      const chatRoomData = PrismaCreateRoomMapper.toPrisma(createRoomRequest);

      const createdChatRoom = await prisma.chatRoom.create({
        data: {
          ...chatRoomData,
          manutence: { connect: { id: createdManutence.id } },
        },
      });

      await prisma.manutence.update({
        where: { id: createdManutence.id },
        data: { chatRoomId: createdChatRoom.id },
      });

      const rawManutenceHistory = PrismaHistoryManutenceMapper.toPrisma(
        ActionHistory.MANUTENCE_CREATED,
        manutence,
        createdManutence.userId,
        createdManutence.id,
      );

      await prisma.historicoManutencao.create({
        data: rawManutenceHistory,
      });
    });
  }

  async delete(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.manutence.delete({ where: { id: id } });
      const rs = await prisma.historicoManutencao.findFirst({
        where: { id: id },
        include: { manutencao: true, usuario: true },
      });
      if (rs) {
        const userId = this.requestContext.get('userId');

        // todo: review this code below!
        const raw = PrismaHistoryManutenceMapper.toPrisma(
          ActionHistory.MANUTENCE_DELETED,
          rs.manutencao as unknown as Manutence,
          userId,
          rs.manutencao.id,
        );
        //

        await prisma.historicoManutencao.create({
          data: raw,
        });

        //await prisma.historicoManutencao.create({
        //  data: {
        //  id: rs.id,
        //  action: ActionHistory.MANUTENCE_DELETED,
        //  data: rs.data,
        //  manutencao: {
        //    connect: { id: rs.manutencao.id }
        //   },
        // usuario: {
        //   connect: { id: userId }
        // },
        // },
        // });
      } else {
        return;
      }
    });
  }

  async findMany(pagination: Pagination): Promise<Manutence[] | []> {
    const manutences = await this.prisma.manutence.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
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
          connect: { id: adminId }
        }
      }
    });
  }
}
