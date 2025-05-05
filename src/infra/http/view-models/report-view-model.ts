import { Report } from '@application/entities/report';

export class ReportViewModel {
  static toGetFormatHttp(report: Report) {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      user: {
        name: report.user?.name,
        email: report.user?.email,
      },
    };
  }
}
