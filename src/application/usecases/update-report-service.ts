import { ReportRepository } from '@application/repositories/report-repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdateReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    id: string,
    request: Partial<{ title: string; description: string }>,
  ) {
    const report = await this.reportRepository.findById(id);

    if (!report) {
      throw new NotFoundException('report not found');
    }

    if (request.title) {
      report.title = request.title;
    }
    if (request.description) {
      report.description = request.description;
    }

    await this.reportRepository.update(id, report);

    return report;
  }
}
