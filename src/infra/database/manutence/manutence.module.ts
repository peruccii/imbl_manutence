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
import { FileUploadService } from '@application/usecases/file-upload-service';
import { GetPreSignedUrlService } from '@application/usecases/get-presigned-url-service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [
    FileUploadService,
    ManutenceCreateService,
    FindOneManutenceService,
    FindAllManutences,
    DeleteManutenceService,
    GetPreSignedUrlService,
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
    FileUploadService,
    DeleteManutenceService,
    GetCountNewManutences,
    FindManutenceByFilters,
    GetPreSignedUrlService,
    ManutenceRepository,
  ],
})
export class ManutenceModule {}
