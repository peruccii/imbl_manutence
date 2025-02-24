import { GetAllChatsRoomService } from '@application/usecases/get-all-chats-room-service';
import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination-dto';
import { ChatRoom } from '@application/entities/chat_room';
import { ChatRoomViewModel } from '../view-models/chat-room-view-model';
import { GetAllChatsRoomWithMessageService } from '@application/usecases/get-chats-with-messages-service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly getall: GetAllChatsRoomService,
    private readonly getwithmessages: GetAllChatsRoomWithMessageService,
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
}
