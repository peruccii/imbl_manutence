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
import { ChatModule } from '@infra/database/chat/chat.module';
import { ChatGateway } from '@infra/database/chat/chat-gateway';
import { ChatController } from './controllers/chat.controller';
import { GetAllChatsRoomService } from '@application/usecases/get-all-chats-room-service';
import { GetAllChatsRoomWithMessageService } from '@application/usecases/get-chats-with-messages-service';
// import { S3Module } from '@infra/database/s3/s3.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from '@application/config/multer-config';
import { ManutenceModule } from '@infra/database/manutence/manutence.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetAllUsersService } from '@application/usecases/find-all-users-service';
import { FindByIdUserService } from '@application/usecases/get-user-by-id-service';
import { FindByEmailUserService } from '@application/usecases/get-user-by-email-service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ChatModule,
    UserModule,
    ManutenceModule,
    // S3Module,
    PrismaModule,
    MulterModule.registerAsync(multerOptionsFactory),
  ],
  controllers: [ManutenceController, UserController, ChatController],
  providers: [
    DeleteUserService,
    FileUploadService,
    FindOneManutenceService,
    FindAllManutences,
    ChatGateway,
    AuthGuard,
    RolesGuard,
    GetAllChatsRoomService,
    RequestContext,
    DeleteManutenceService,
    GetAllChatsRoomWithMessageService,
    GetCountNewManutences,
    FindManutenceByFilters,
  ],
})
export class HttpModule {}
