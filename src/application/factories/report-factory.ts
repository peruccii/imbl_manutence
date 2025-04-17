import type { CreateReportRequest } from '@application/interfaces/create-report-request';
import { Report } from '../entities/report';

type Override = CreateReportRequest;

export function makeReportFactory(override: Override) {
  return new Report({
    description: override.description,
    userId: override.userId,
    manutenceId: override.manutenceId,
    title: override.title,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
