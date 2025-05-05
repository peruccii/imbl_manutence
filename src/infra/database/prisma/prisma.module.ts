import { Module } from '@nestjs/common';
import { ManutenceRepository } from 'src/application/repositories/manutence-repository';
import { UserRepository } from 'src/application/repositories/user-repository';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { PrismaManutenceRepository } from './repositories/prisma-manutence-repository';
import { RequestContext } from '@application/utils/request-context';
import { HistoryManutenceRepository } from '@application/repositories/history-manutence-repository';
import { PrismaHistoryManutenceRepository } from './repositories/prisma-history-manutence-repository';
import { ReportRepository } from '@application/repositories/report-repository';
import { PrismaReportRepository } from './repositories/prisma-report-repository';

@Module({
  providers: [
    PrismaService,
    RequestContext,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ManutenceRepository,
      useClass: PrismaManutenceRepository,
    },
    {
      provide: HistoryManutenceRepository,
      useClass: PrismaHistoryManutenceRepository,
    },
    {
      provide: ReportRepository,
      useClass: PrismaReportRepository,
    },
  ],
  exports: [
    PrismaService,
    RequestContext,
    UserRepository,
    ReportRepository,
    ManutenceRepository,
    HistoryManutenceRepository,
  ],
})
export class PrismaModule {}
