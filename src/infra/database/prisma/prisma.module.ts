import { Module } from '@nestjs/common';
import { ManutenceRepository } from 'src/application/repositories/manutence-repository';
import { UserRepository } from 'src/application/repositories/user-repository';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { PrismaManutenceRepository } from './repositories/prisma-manutence-repository';
import { RequestContext } from '@application/utils/request-context';

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
  ],
  exports: [
    PrismaService,
    RequestContext,
    UserRepository,
    ManutenceRepository,
  ],
})
export class PrismaModule {}