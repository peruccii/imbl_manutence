import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/application/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { User } from 'src/application/entities/user';
import { Manutence } from '@application/entities/manutence';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data: raw,
    });
  }

  async findOne(id: string): Promise<User | null> {
     const user = await this.prisma.user.findUnique({
         where: { id: id },
         include: {
           manutences: true,
         },
       });

      if (user) {
        const manutences = user.manutences
        return PrismaUserMapper.toDomain(user, manutences as unknown as Manutence[]);
      }

      return null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
        where: { email: email },
        include: {
          manutences: true,
        },
      });

     if (user) {
       const manutences = user.manutences
       return PrismaUserMapper.toDomain(user, manutences as unknown as Manutence[]);
     }

     return null
 }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id: id } });
  }
}
