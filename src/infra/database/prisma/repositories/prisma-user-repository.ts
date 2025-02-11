import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/application/repositories/user-repository";
import { PrismaService } from "../prisma.service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { User } from "src/application/entities/user";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
    findOne(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
 
  async create(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data: {
        ...raw
      },
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({ where: { id: id } });
  }

}