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
        id: report.user?.id || report.userId,
        name: report.user?.name?.value || report.user?.name || '',
        email: report.user?.email?.value || report.user?.email || '',
        avatar: "/placeholder.svg?height=40&width=40",
      },
    };
  }
}
