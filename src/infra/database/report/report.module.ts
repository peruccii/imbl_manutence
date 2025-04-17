import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportRepository } from '@application/repositories/report-repository';
import { PrismaReportRepository } from '../prisma/repositories/prisma-report-repository';
import { CreateReportService } from '@application/usecases/create-report-service';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { PrismaManutenceRepository } from '../prisma/repositories/prisma-manutence-repository';
import { UserRepository } from '@application/repositories/user-repository';
import { PrismaUserRepository } from '../prisma/repositories/prisma-user-repository';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateReportService,
    {
      provide: ReportRepository,
      useClass: PrismaReportRepository,
    },
    {
      provide: ManutenceRepository,
      useClass: PrismaManutenceRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CreateReportService],
})
export class ReportModule {}
