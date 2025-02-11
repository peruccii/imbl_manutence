import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ManutenceRepository } from "src/application/repositories/manutence-repository";
import { Manutence } from "src/application/entities/manutence";

@Injectable()
export class PrismaManutenceRepository implements ManutenceRepository {
  constructor(private prisma: PrismaService) {}
    update(id: string): void {
        throw new Error("Method not implemented.");
    }
    find(id: string): Promise<Manutence | null> {
        throw new Error("Method not implemented.");
    }

  async create(manutence: Manutence): Promise<void> {
    const raw = PrismaInviteMapper.toPrisma(manutence);
    await this.prisma.manutence.create({
      data: {
        ...raw,
        date: raw.date || null,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.manutence.delete({ where: { id: id } });
  }

  async findMany(): Promise<Manutence[]> {
    const users = await this.prisma.manutence.findMany();

    return users.map((invite) => {
      return PrismaInviteMapper.toDomain(invite);
    });
  }
}