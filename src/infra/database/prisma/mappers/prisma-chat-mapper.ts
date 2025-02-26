import {
  ChatRoom,
} from '@application/entities/chat_room';
import { Message } from '@application/entities/message';
import { User } from '@application/entities/user';

export class PrismaChatRoomMapper {
  static toDomain(rawChatRoom: any): ChatRoom {
    return new ChatRoom(
      {
        name: rawChatRoom.name,
        createdAt: rawChatRoom.createdAt,
        updatedAt: rawChatRoom.updatedAt,
        users: rawChatRoom.users.map(
          (user: User) =>
            new User({
              manutences: [],
              name: user.name,
              email: user.email,
              password: user.password,
              telephone: user.telephone,
              typeUser: user.typeUser,
              createdAt: user.createdAt,
            }),
        ),
        messages: rawChatRoom.messages.map(
          (msg: Message) =>
            new Message({
              content: msg.content,
              senderId: msg.senderId,
              chatRoomId: msg.chatRoomId,
              createdAt: msg.createdAt,
            }),
        ),
      },
      rawChatRoom.id,
    );
  }

  static toPrisma(msg: string, senderId: string, roomId: string) {
    return {
      content: msg,
      chatRoom: {
        connect: { id: roomId },
      },
      sender: {
        connect: { id: senderId },
      },
    };
  }
}
