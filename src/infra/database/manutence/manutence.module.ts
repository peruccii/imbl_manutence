import { Module } from '@nestjs/common';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  providers: [ManutenceCreateService],
  exports: [ManutenceCreateService],
})
export class ManutenceModule {}
