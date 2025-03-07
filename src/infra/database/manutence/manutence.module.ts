import { Module } from '@nestjs/common';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { PrismaModule } from '../prisma/prisma.module';
import { FindOneManutenceService } from '@application/usecases/find-one-manutence-service';
import { FindAllManutences } from '@application/usecases/find-all-manutences-service';
import { DeleteManutenceService } from '@application/usecases/delete-manutence-service';
import { GetCountNewManutences } from '@application/usecases/count-new-manutences-service';
import { FindManutenceByFilters } from '@application/usecases/find-by-filter-manutence-dto';
import { PrismaManutenceRepository } from '../prisma/repositories/prisma-manutence-repository';
import { ManutenceRepository } from '@application/repositories/manutence-repository';

@Module({
  imports: [PrismaModule],
  providers: [
    ManutenceCreateService,
    FindOneManutenceService,
    FindAllManutences,
    DeleteManutenceService,
    GetCountNewManutences,
    FindManutenceByFilters,
    {
      provide: ManutenceRepository,
      useClass: PrismaManutenceRepository,
    },
  ],
  exports: [
    ManutenceCreateService,
    FindOneManutenceService,
    FindAllManutences,
    DeleteManutenceService,
    GetCountNewManutences,
    FindManutenceByFilters,
    ManutenceRepository,
  ],
})
export class ManutenceModule {}
