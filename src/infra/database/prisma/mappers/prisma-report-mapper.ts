import { Report } from '@application/entities/report';
import { Report as RawReport } from '@prisma/client';

export class PrismaReportMapper {
  static toPrisma(report: Report) {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      userId: report.userId,
      manutenceId: report.manutenceId,
    };
  }

  static toDomain(rawReport: any): Report {
    const report = new Report(
      {
        ...rawReport,
        updatedAt: rawReport.updatedAt || rawReport.createdAt,
      },
      rawReport.id,
    );

    return report;
  }
}
