import { ChatRoom } from '@application/entities/chat_room';
import { Message } from '@application/entities/message';
import { User } from '@application/entities/user';
import { Manutence } from '@application/entities/manutence';

export class PrismaChatRoomMapper {
  static toDomain(rawChatRoom: any): ChatRoom {
    return new ChatRoom(
      {
        name: rawChatRoom.name,
        createdAt: rawChatRoom.createdAt,
        updatedAt: rawChatRoom.updatedAt,
        users: rawChatRoom.users.map(
          (user: any) =>
            new User({
              cpf: user.cpf,
              manutences: [],
              name: user.name,
              email: user.email,
              address: user.address,
              password: user.password,
              telephone: user.telephone,
              typeUser: user.typeUser,
              createdAt: user.createdAt,
            }),
        ),
        messages:
          rawChatRoom.messages?.map(
            (msg: any) =>
              new Message({
                content: msg.content,
                senderId: msg.senderId,
                chatRoomId: msg.chatRoomId,
                createdAt: msg.createdAt,
                isRead: msg.isRead,
                senderType: msg.senderType,
              }),
          ) || [],
        manutence: rawChatRoom.manutence
          ? new Manutence(
              {
                message: rawChatRoom.manutence.message,
                photos: rawChatRoom.manutence.photos,
                video: rawChatRoom.manutence.video,
                title: rawChatRoom.manutence.title,
                address: rawChatRoom.manutence.address,
                status_manutence: rawChatRoom.manutence.status_manutence,
                createdAt: rawChatRoom.manutence.createdAt,
                userId: rawChatRoom.manutence.userId,
                adminId: rawChatRoom.manutence.adminId,
                specialties: rawChatRoom.manutence.specialties,
                chatRoomId: rawChatRoom.manutence.chatRoomId,
                user: rawChatRoom.manutence.user
                  ? new User({
                      manutences: [],
                      name: rawChatRoom.manutence.user.name,
                      email: rawChatRoom.manutence.user.email,
                      password: rawChatRoom.manutence.user.password,
                      telephone: rawChatRoom.manutence.user.telephone,
                      typeUser: rawChatRoom.manutence.user.typeUser,
                      cpf: rawChatRoom.manutence.user.cpf,
                      address: rawChatRoom.manutence.user.address,
                      createdAt: rawChatRoom.manutence.user.createdAt,
                    })
                  : undefined,
              },
              rawChatRoom.manutence.id,
            )
          : undefined,
        lastMessage: rawChatRoom.lastMessage
          ? new Message({
              content: rawChatRoom.lastMessage.content,
              senderId: rawChatRoom.lastMessage.senderId,
              chatRoomId: rawChatRoom.lastMessage.chatRoomId,
              createdAt: rawChatRoom.lastMessage.createdAt,
              isRead: rawChatRoom.lastMessage.isRead,
              senderType: rawChatRoom.lastMessage.senderType,
            })
          : undefined,
        unreadCount: rawChatRoom.unreadCount || 0,
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
