import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ManutenceRepository } from 'src/application/repositories/manutence-repository';
import { Manutence } from 'src/application/entities/manutence';
import { PrismaManutenceMapper } from '../mappers/prisma-manutence-mapper';
import { UserNotFoundMessage } from 'src/application/messages/user-not-found';
import { Pagination } from '@application/interfaces/pagination';
import { FiltersManutence } from '@application/interfaces/filters-manutence';
import { PrismaHistoryManutenceMapper } from '../mappers/prisma-history-manutence-mapper';
import { ActionHistory } from '@application/enums/action.enum';
import { RequestContext } from '@application/utils/request-context';
import { StatusManutence } from '@application/enums/StatusManutence';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { PrismaCreateRoomMapper } from '../mappers/prisma-create-room-mapper';
import type { CreateChatRoomRequest } from '@application/interfaces/create-room';

@Injectable()
export class PrismaManutenceRepository implements ManutenceRepository {
  constructor(
    private requestContext: RequestContext,
    private prisma: PrismaService,
  ) {}

  async findByFilters(
    filters: FiltersManutence,
    pagination: Pagination,
  ): Promise<Manutence[] | null> {
    const manutences = await this.prisma.manutence.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      where: {
        status_manutence: { in: filters.status_manutence },
      },
    });

    return manutences.map((manutence) => {
      return PrismaManutenceMapper.toDomain(manutence);
    });
  }

  async update(id: string): Promise<void> {}

  async find(id: string): Promise<Manutence | null> {
    const manutence = await this.prisma.manutence.findUnique({
      where: { id: id },
      include: {
        user: true,
      },
    });

    if (!manutence) throw new NotFoundErrorHandler(UserNotFoundMessage);

    return PrismaManutenceMapper.toDomain(manutence);
  }

  async create(manutence: Manutence): Promise<void> {
    const raw = PrismaManutenceMapper.toPrisma(manutence);
    await this.prisma.$transaction(async (prisma) => {
      const createdManutence = await prisma.manutence.create({
        data: raw,
      });

      const createRoomRequest: CreateChatRoomRequest = {
        name: manutence.user ? manutence.user.name.value : createdManutence.id,
        users: [manutence.user!],
        messages: [],
      };

      const msg = PrismaCreateRoomMapper.toPrisma(createRoomRequest);

      await prisma.chatRoom.create({
        data: msg,
      });

      const userId = this.requestContext.get('userId');

      // todo: review this code below!
      const rawManutence = PrismaHistoryManutenceMapper.toPrisma(
        ActionHistory.MANUTENCE_CREATED,
        manutence,
        userId,
        createdManutence.id,
      );
      //

      await prisma.historicoManutencao.create({
        data: rawManutence,
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
}
