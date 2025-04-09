import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/application/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { User } from 'src/application/entities/user';
import { Manutence } from '@application/entities/manutence';
import type { Pagination } from '@application/interfaces/pagination';
import type { Role } from '@application/enums/role.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User, pass: string): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data: {
        ...raw,
        password: pass,
      },
    });
  }

  async transferManutencesToNewAdmin(
    manutences: Manutence[],
    newAdminId: string,
    adminId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: newAdminId },
        data: {
          manutences: {
            connect: manutences.map((manutence) => ({ id: manutence.id })),
          },
        },
      });
      await prisma.user.update({
        where: { id: adminId },
        data: {
          manutences: {
            disconnect: manutences.map((manutence) => ({ id: manutence.id })),
          },
        },
      });
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        manutences: true,
        adminManutences: true,
      },
    });

    if (user) {
      const manutences = user.manutences;
      const adminManutences = user.adminManutences;
      return PrismaUserMapper.toDomain(
        user,
        user.typeUser === 'ADMIN'
          ? (adminManutences as unknown as Manutence[])
          : (manutences as unknown as Manutence[]),
      );
    }

    return null;
  }

  async findByRole(role: Role, pagination: Pagination): Promise<User[] | []> {
    const users = await this.prisma.user.findMany({
      where: { typeUser: role },
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        adminManutences: true,
      },
    });

    const manutences = users.map((user) => user.adminManutences);

    return users.map((user) => {
      return PrismaUserMapper.toDomain(
        user,
        manutences as unknown as Manutence[],
      );
    });
  }

  async findMany(pagination: Pagination): Promise<User[] | []> {
    const users = await this.prisma.user.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        manutences: true,
      },
    });

    const manutences = users.map((user) => user.manutences);

    return users.map((user) => {
      return PrismaUserMapper.toDomain(
        user,
        manutences as unknown as Manutence[],
      );
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        manutences: true,
      },
    });

    if (user) {
      const manutences = user.manutences;
      return PrismaUserMapper.toDomain(
        user,
        manutences as unknown as Manutence[],
      );
    }

    return null;
  }

  async delete(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      await this.prisma.historicoManutencao.deleteMany({
        where: {
          usuarioId: id,
        },
      });

      await this.prisma.message.deleteMany({
        where: {
          senderId: id,
        },
      });

      const userChatRooms = await this.prisma.chatRoom.findMany({
        where: {
          users: {
            some: {
              id: id,
            },
          },
        },
      });

      for (const chatRoom of userChatRooms) {
        await this.prisma.chatRoom.update({
          where: { id: chatRoom.id },
          data: {
            users: {
              disconnect: { id: id },
            },
          },
        });
      }

      await this.prisma.manutence.deleteMany({
        where: {
          userId: id,
        },
      });

      await this.prisma.user.delete({ where: { id: id } });
    });
  }
}
