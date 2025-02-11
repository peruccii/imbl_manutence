import { Module } from '@nestjs/common';
import { ManutenceRepository } from 'src/application/repositories/manutence-repository';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';

@Module({
  providers: [
    ManutenceCreateService,
    {
      provide: ManutenceRepository,
      useClass: ManutenceCreateService,
    },
  ],
  exports: [ManutenceRepository],
})
export class ManutenceModule {}
