import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ManutenceController } from './controllers/manutence.controller';
import { UserController } from './controllers/user.controller';
import { UserCreateService } from 'src/application/usecases/user-create-service';
import { ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { RolesGuard } from 'src/application/guards/role.guards';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DeleteUserService } from 'src/application/usecases/delete-user-service';
import { RequestContext } from '@application/utils/request-context';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '@infra/database/user/user.module';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { FileUploadService } from '@application/usecases/file-upload-service';
import { FindOneManutenceService } from '@application/usecases/find-one-manutence-service';
import { FindAllManutences } from '@application/usecases/find-all-manutences-service';
import { DeleteManutenceService } from '@application/usecases/delete-manutence-service';
import { GetCountNewManutences } from '@application/usecases/count-new-manutences-service';
import { FindManutenceByFilters } from '@application/usecases/find-by-filter-manutence-dto';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env',
    }),
  ],
  controllers: [ManutenceController, UserController],
  providers: [
    UserCreateService,
    DeleteUserService,
    FileUploadService,
    FindOneManutenceService,
    FindAllManutences,
    RequestContext,
    DeleteManutenceService,
    GetCountNewManutences,
    ManutenceCreateService,
    FindManutenceByFilters,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class HttpModule {}
