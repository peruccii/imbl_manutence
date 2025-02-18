import { UserRepository } from '@application/repositories/user-repository';
import { Module } from '@nestjs/common';
import { UserCreateService } from 'src/application/usecases/user-create-service';
import { PrismaUserRepository } from '../prisma/repositories/prisma-user-repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    UserCreateService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository, 
    },
  ],
  exports: [UserCreateService, UserRepository], 
})
export class UserModule {}