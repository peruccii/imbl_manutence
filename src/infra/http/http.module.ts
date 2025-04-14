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
import { ChatController } from './controllers/chat.controller';
import { GetAllChatsRoomService } from '@application/usecases/get-all-chats-room-service';
import { GetAllChatsRoomWithMessageService } from '@application/usecases/get-chats-with-messages-service';
import { S3Module } from '@infra/database/s3/s3.module';
import { ManutenceModule } from '@infra/database/manutence/manutence.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetPreSignedUrlService } from '@application/usecases/get-presigned-url-service';
import { AcceptManutenceService } from '@application/usecases/accept-manutence-service';
import { PrismaManutenceRepository } from '@infra/database/prisma/repositories/prisma-manutence-repository';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { FindAdminChatRoomsService } from '@application/usecases/find-admin-chat-rooms-service';
import { ChatRepository } from '@application/repositories/chat-repository';
import { PrismaChatRepository } from '../database/prisma/repositories/prisma-chat-repository';
import { CreateMessageService } from '@application/usecases/create-message-service';
import { FindUserChatRoomsService } from '@application/usecases/find-user-chat-rooms-service';
import { SendMessageService } from '@application/usecases/send-message-service';
import { HistoryController } from './controllers/history.controller';
import { HistoryModule } from '@infra/database/history/history.module';
import { TransferManutencesToNewAdminService } from '@application/usecases/transfer-manutences-to-new-admin-service';
import { GetAllAdminsService } from '@application/usecases/get-all-admins-service';
import { ReadMessageService } from '@application/usecases/read-messages-service';
import { UpdateUserService } from '@application/usecases/update-user-service';
import { GetMessagesByRoomNameService } from '@application/usecases/get-messages-by-roomname-service';
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ChatModule,
    UserModule,
    ManutenceModule,
    S3Module,
    PrismaModule,
    HistoryModule,
  ],
  controllers: [
    ManutenceController,
    UserController,
    ChatController,
    HistoryController,
  ],
  providers: [
    PrismaService,
    RequestContext,
    AuthGuard,
    RolesGuard,
    DeleteUserService,
    FileUploadService,
    FindOneManutenceService,
    FindAllManutences,
    GetPreSignedUrlService,
    GetAllChatsRoomService,
    DeleteManutenceService,
    GetAllAdminsService,
    GetAllChatsRoomWithMessageService,
    GetCountNewManutences,
    TransferManutencesToNewAdminService,
    FindManutenceByFilters,
    AcceptManutenceService,
    FindAdminChatRoomsService,
    FindUserChatRoomsService,
    CreateMessageService,
    {
      provide: ManutenceRepository,
      useClass: PrismaManutenceRepository,
    },
    {
      provide: ChatRepository,
      useClass: PrismaChatRepository,
    },
    SendMessageService,
    ReadMessageService,
    UpdateUserService,
    GetMessagesByRoomNameService,
  ],
})
export class HttpModule {}
