import { makeReportFactory } from '@application/factories/report-factory';
import { CreateReportRequest } from '@application/interfaces/create-report-request';
import { ReportRepository } from '@application/repositories/report-repository';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { UserRepository } from '@application/repositories/user-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly manutenceRepository: ManutenceRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateReportRequest): Promise<void> {
    const { userId, manutenceId } = request;
    if (!userId || !manutenceId) {
      throw new Error('User ID and Manutence ID are required');
    }

    const manutence = await this.manutenceRepository.find(manutenceId);
    if (!manutence) {
      throw new Error('Manutence not found');
    }

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const reportWithSameTitle = manutence.reports.find(
      (report) => report.title === request.title,
    );

    if (reportWithSameTitle) {
      throw new Error('Manutence already has a report with the same title');
    }

    const report = makeReportFactory(request);
    await this.reportRepository.create(report);
  }
}
