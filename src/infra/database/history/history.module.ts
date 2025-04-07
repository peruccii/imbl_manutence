import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoryManutenceRepository } from '@application/repositories/history-manutence-repository';
import { PrismaHistoryManutenceRepository } from '../prisma/repositories/prisma-history-manutence-repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: HistoryManutenceRepository,
      useClass: PrismaHistoryManutenceRepository,
    },
  ],
  exports: [HistoryManutenceRepository],
})
export class HistoryModule {}
