import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { 
   ManutenceRepository } from 'src/application/repositories/manutence-repository';
import { Manutence } from 'src/application/entities/manutence';
import { PrismaManutenceMapper } from '../mappers/prisma-manutence-mapper';
import { UserNotFoundError } from 'src/application/errors/user-not-found.errors';
import { UserNotFoundMessage } from 'src/application/messages/user-not-found';
import { Pagination } from '@application/interfaces/pagination';
import { FiltersManutence } from '@application/interfaces/filters-manutence';
import { PrismaHistoryManutenceMapper } from '../mappers/prisma-history-manutence-mapper';
import { MANUTENCE_CREATED } from '@application/utils/constants';
import { randomUUID } from 'crypto';
import { HistoryManutence } from '@application/entities/history_manutence';

@Injectable()
export class PrismaManutenceRepository implements ManutenceRepository {
  constructor(private prisma: PrismaService) {}

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

    if (!manutence) throw new UserNotFoundError(UserNotFoundMessage);

    return PrismaManutenceMapper.toDomain(manutence);
  }

  async create(manutence: Manutence): Promise<void> {
    const raw = PrismaManutenceMapper.toPrisma(manutence);
    await this.prisma.$transaction(async (prisma) => {
      const createdManutence = await prisma.manutence.create({
        data: raw,
      });
    
      const rawManutence = PrismaHistoryManutenceMapper.toPrisma(manutence, createdManutence.id)
      await prisma.historicoManutencao.create({
        data: rawManutence,
      });
    });
  }

  async delete(id: string) {
    await this.prisma.manutence.delete({ where: { id: id } });
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
}
