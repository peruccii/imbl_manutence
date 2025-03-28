import { ChatRoomProps } from '@application/entities/chat_room';

export class ChatRoomViewModel {
  static toGetFormatHttp(chat_room: ChatRoomProps) {
    return {
      name: chat_room.name,
      messages: chat_room.messages,
      createdAt: chat_room.createdAt,
      users: chat_room.users,
      updatedAt: chat_room.updatedAt,
      manutence: chat_room.manutence ? {
        id: chat_room.manutence.id,
        title: chat_room.manutence.title,
        status_manutence: chat_room.manutence.status_manutence,
        user: chat_room.manutence.user ? {
          id: chat_room.manutence.user.id,
          name: chat_room.manutence.user.name.value,
          email: chat_room.manutence.user.email.value
        } : null
      } : null
    };
  }
}
