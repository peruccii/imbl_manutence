import { GetAllChatsRoomService } from '@application/usecases/get-all-chats-room-service';
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
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
import { UserId } from '@application/utils/extract-user-id';
import { ReadMessageService } from '@application/usecases/read-messages-service';
import { GetMessagesByRoomNameService } from '@application/usecases/get-messages-by-roomname-service';
import { MessageViewModel } from '../view-models/message-view-model';
class SendMessageDto {
  content: string;
  roomName: string;
  senderType: string;
}

@Controller('chat')
export class ChatController {
  constructor(
    private readonly getall: GetAllChatsRoomService,
    private readonly getwithmessages: GetAllChatsRoomWithMessageService,
    private findAdminChatRoomsService: FindAdminChatRoomsService,
    private findUserChatRoomsService: FindUserChatRoomsService,
    private readonly sendMessageService: SendMessageService,
    private readonly readMessageService: ReadMessageService,
    private readonly getMessagesByRoomNameService: GetMessagesByRoomNameService,
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

  @Get('messages/:roomName')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getMessagesByRoomName(@Param('roomName') roomName: string) {
    const messages = await this.getMessagesByRoomNameService.execute(roomName);
    return messages.map((message) => {
      return MessageViewModel.toGetFormatHttp(message);
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
  async findUserChatRooms(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return await this.findUserChatRoomsService.execute({
      userId,
      pagination,
    });
  }

  @Post('message/read')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async readMessage(@Body() roomId: string) {
    return await this.readMessageService.execute(roomId);
  }

  @Post('message')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendMessage(
    @UserId() userId: string,
    @Body() messageDto: SendMessageDto,
  ) {
    await this.sendMessageService.execute({
      content: messageDto.content,
      roomName: messageDto.roomName,
      senderId: userId,
      senderType: messageDto.senderType,
    });

    return { message: 'Mensagem enviada com sucesso' };
  }
}
