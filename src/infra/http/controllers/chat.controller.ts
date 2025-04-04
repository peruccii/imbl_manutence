import { GetAllChatsRoomService } from '@application/usecases/get-all-chats-room-service';
import { Controller, Get, Param, Query, UseGuards, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from '@application/guards/role.guards';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/application/enums/role.enum';
import { FindAdminChatRoomsService } from '@application/usecases/find-admin-chat-rooms-service';
import { PaginationDto } from '../dto/pagination-dto';
import { ChatRoom } from '@application/entities/chat_room';
import { ChatRoomViewModel } from '../view-models/chat-room-view-model';
import { GetAllChatsRoomWithMessageService } from '@application/usecases/get-chats-with-messages-service';
import { FindUserChatRoomsService } from '@application/usecases/find-user-chat-rooms-service';
import { SendMessageService } from '@application/usecases/send-message-service';
import { RequestContext } from '@application/utils/request-context';
import { UserId } from '@application/utils/extract-user-id';

class SendMessageDto {
  content: string;
  roomName: string;
}

@Controller('chat')
export class ChatController {
  constructor(
    private readonly getall: GetAllChatsRoomService,
    private readonly getwithmessages: GetAllChatsRoomWithMessageService,
    private findAdminChatRoomsService: FindAdminChatRoomsService,
    private findUserChatRoomsService: FindUserChatRoomsService,
    private readonly sendMessageService: SendMessageService,
    private readonly requestContext: RequestContext,
  ) {}

  @Get('all')
  async getAllChatsRoom(@Query() pagination: PaginationDto) {
    const { chats } = await this.getall.execute(pagination);

    return chats.map((chat: ChatRoom) => {
      return ChatRoomViewModel.toGetFormatHttp(chat);
    });
  }

  async getChatsWithMessages(@Query() pagination: PaginationDto) {
    const { chats } = await this.getwithmessages.execute(pagination);

    return chats.map((chat: ChatRoom) => {
      return ChatRoomViewModel.toGetFormatHttp(chat);
    });
  }

  @Get('admin/:adminId/rooms')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAdminChatRooms(
    @Param('adminId') adminId: string,
    @Query() pagination: PaginationDto,
  ) {
    return await this.findAdminChatRoomsService.execute({
      adminId,
      pagination,
    });
  }

  @Get('user/:userId/rooms')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  async findUserChatRooms(@Param('userId') userId: string, @Query() pagination: PaginationDto) {
    return await this.findUserChatRoomsService.execute({
      userId,
      pagination,
    });
  }

  @Post('message')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendMessage(@UserId() userId: string, @Body() messageDto: SendMessageDto) {
    console.log('oi');
    await this.sendMessageService.execute({
      content: messageDto.content,
      roomName: messageDto.roomName,
      senderId: userId,
    });

    return { message: 'Mensagem enviada com sucesso' };
  }
}
