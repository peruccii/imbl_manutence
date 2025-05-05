import { Report } from '@application/entities/report';
import { ReportRepository } from '@application/repositories/report-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListAllReportsService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(): Promise<Report[] | []> {
    const reports = await this.reportRepository.findAll();

    if (!reports) {
      throw new Error('No reports found');
    }

    return reports;
  }
}
