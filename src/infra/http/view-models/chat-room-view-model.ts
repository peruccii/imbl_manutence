import { ChatRoomProps } from '@application/entities/chat_room';

export class ChatRoomViewModel {
  static toGetFormatHttp(chat_room: ChatRoomProps) {
    return {
      a: chat_room.name,
      messages: chat_room.messages,
      createdAt: chat_room.createdAt,
      users: chat_room.users,
      updatedAt: chat_room.updatedAt,
    };
  }
}
