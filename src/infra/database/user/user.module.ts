import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserCreateService } from '@application/usecases/user-create-service';
import { FindByIdUserService } from '@application/usecases/get-user-by-id-service';
import { FindByEmailUserService } from '@application/usecases/get-user-by-email-service';
import { GetAllUsersService } from '@application/usecases/find-all-users-service';
import { PrismaUserRepository } from '../prisma/repositories/prisma-user-repository';
import { UserRepository } from '@application/repositories/user-repository';

@Module({
  imports: [PrismaModule],
  providers: [
    UserCreateService,
    FindByEmailUserService,
    FindByIdUserService,
    GetAllUsersService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    UserCreateService,
    FindByEmailUserService,
    FindByIdUserService,
    GetAllUsersService,
    UserRepository,
  ],
})
export class UserModule {}
