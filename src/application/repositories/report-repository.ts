import { Report } from '../entities/report';

export abstract class ReportRepository {
  abstract create(report: Report): Promise<void>;
  abstract findById(id: string): Promise<Report | null>;
  abstract findByManutenceId(manutenceId: string): Promise<Report[]>;
  abstract findByUserId(userId: string): Promise<Report[]>;
  abstract findAll(): Promise<Report[]>;
  abstract update(id: string, data: Partial<Report>): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
