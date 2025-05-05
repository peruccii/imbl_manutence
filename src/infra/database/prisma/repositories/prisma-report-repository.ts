import { Injectable } from '@nestjs/common';
import { ReportRepository } from '@application/repositories/report-repository';
import { PrismaService } from '../prisma.service';
import { PrismaReportMapper } from '../mappers/prisma-report-mapper';
import { Report } from '@application/entities/report';

@Injectable()
export class PrismaReportRepository implements ReportRepository {
  constructor(private prisma: PrismaService) {}

  async create(report: Report): Promise<void> {
    const raw = PrismaReportMapper.toPrisma(report);

    await this.prisma.report.create({
      data: raw,
    });
  }

  async findById(id: string): Promise<Report | null> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    return report ? PrismaReportMapper.toDomain(report) : null;
  }

  async findByManutenceId(manutenceId: string): Promise<Report[] | []> {
    const reports = await this.prisma.report.findMany({
      where: { manutenceId },
    });

    return reports.map(PrismaReportMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Report[] | []> {
    const reports = await this.prisma.report.findMany({
      where: { userId },
    });

    return reports.map(PrismaReportMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.report.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Report[] | []> {
    const reports = await this.prisma.report.findMany({
      include: {
        user: true,
      },
    });

    return reports.map(PrismaReportMapper.toDomain);
  }

  async update(id: string, data: Partial<Report>): Promise<void> {
    const updateData: any = { ...data };

    if (data.userId !== undefined) {
      updateData.userId = data.userId;
    }

    await this.prisma.report.update({
      where: { id },
      data: updateData,
    });
  }
}
