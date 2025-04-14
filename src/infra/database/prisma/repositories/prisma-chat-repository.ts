import { ChatRoom } from '@application/entities/chat_room';
import { ChatRepository } from '@application/repositories/chat-repository';
import { PrismaService } from '../prisma.service';
import { Pagination } from '@application/interfaces/pagination';
import { PrismaChatRoomMapper } from '../mappers/prisma-chat-mapper';
import { SendMessageInterface } from '@application/interfaces/send-message';
import { CreateChatRoomRequest } from '@application/interfaces/create-room';
import { PrismaCreateRoomMapper } from '../mappers/prisma-create-room-mapper';
import { RoomUser } from '@application/interfaces/room-users-interface';
import { Manutence } from '@application/entities/manutence';
import { PrismaManutenceMapper } from '../mappers/prisma-manutence-mapper';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { ManutenceNotFoundMessage } from '@application/messages/manutence-not-found';
import { Injectable } from '@nestjs/common';
import { Message } from '@application/entities/message';
import type { Role } from '@application/enums/role.enum';
import { User } from '@application/entities/user';

@Injectable()
export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pagination: Pagination): Promise<ChatRoom[] | []> {
    throw new Error('Method not implemented.');
  }
  async findAllWithMessages(pagination: Pagination): Promise<ChatRoom[] | []> {
    throw new Error('Method not implemented.');
  }

  async findManutenceByChatRoom(chatRoomId: string): Promise<Manutence | null> {
    const manutenceRaw = await this.prismaService.manutence.findUnique({
      where: { id: chatRoomId },
      include: { user: true },
    });

    if (!manutenceRaw) throw new NotFoundErrorHandler(ManutenceNotFoundMessage);

    return PrismaManutenceMapper.toDomain(manutenceRaw);
  }

  async sendMessage(request: SendMessageInterface): Promise<void> {
    const { msg, roomName, senderId } = request;
    const room = await this.prismaService.chatRoom.findFirst({
      where: { name: roomName },
    });
    if (!room) throw new Error('Sala não encontrada');

    const message = new Message({
      content: msg,
      senderId,
      senderType: 'user',
      chatRoomId: room.id,
      createdAt: new Date(),
      isRead: false,
    });

    await this.createMessage(message);
  }

  async findRoom(roomName: string): Promise<ChatRoom | null> {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { name: roomName },
      include: {
        users: true,
      },
    });

    if (!room) {
      return null;
    }

    return PrismaChatRoomMapper.toDomain(room);
  }

  async createRoom(request: CreateChatRoomRequest): Promise<void> {
    const data = PrismaCreateRoomMapper.toPrisma(request);
    await this.prismaService.chatRoom.create({ data });
  }

  async getUsersInRoom(roomName: string): Promise<RoomUser[]> {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { name: roomName },
      include: { users: true },
    });
    return (
      room?.users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
      })) || []
    );
  }

  async findAdminChatRooms(adminId: string, pagination: Pagination) {
    const chatRooms = await this.prismaService.chatRoom.findMany({
      skip: Number(pagination.skip),
      take: Number(pagination.limit),
      where: {
        users: {
          some: {
            id: adminId,
          },
        },
        manutence: {
          OR: [{ adminId: adminId }, { userId: adminId }],
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        manutence: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!chatRooms) {
      throw new Error('Chat rooms not found');
    }

    return chatRooms;
  }

  async findUserChatRooms(userId: string, pagination: Pagination) {
    const chatRooms = await this.prismaService.chatRoom.findMany({
      skip: Number(pagination.skip),
      take: Number(pagination.limit),
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        manutence: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!chatRooms) {
      throw new Error('Chat rooms not found');
    }

    return chatRooms;
  }

  async createMessage(message: Message): Promise<void> {
    try {
      const chatRoom = await this.prismaService.chatRoom.findUnique({
        where: { id: message.chatRoomId },
      });

      if (!chatRoom) {
        throw new Error('Chat room não encontrado!');
      }

      const sender = await this.prismaService.user.findUnique({
        where: { id: message.senderId },
      });

      if (!sender) {
        throw new Error('Usuário não encontrado!');
      }
      console.log('message', message);
      const data = {
        content: message.content,
        senderId: message.senderId,
        senderType: message.senderType as Role,
        chatRoomId: message.chatRoomId,
        createdAt: message.createdAt,
        isRead: message.isRead,
      };
      console.log('data', data);
      const createdMessage = await this.prismaService.message.create({
        data: data,
      });

      message.id = createdMessage.id;
      await this.prismaService.chatRoom.update({
        where: { id: message.chatRoomId },
        data: {
          unreadCount: {
            increment: 1,
          },
        },
      });
      console.log('Mensagem criada com sucesso:', createdMessage);
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      throw error;
    }
  }

  async findMessagesByRoomName(roomName: string): Promise<Message[]> {
    const messages = await this.prismaService.message.findMany({
      where: { chatRoom: { name: roomName } },
      include: {
        sender: true,
      },
    });
    return messages.map((message) => {
      return new Message({
        ...message,
        senderId: message.sender.id,
        senderType: message.sender.typeUser as Role,
        chatRoomId: message.chatRoomId,
        createdAt: message.createdAt,
        isRead: message.isRead,
        content: message.content,
      });
    });
  }

  async getUnreadCount(roomId: string): Promise<number> {
    const count = await this.prismaService.message.count({
      where: {
        chatRoomId: roomId,
        isRead: false,
      },
    });
    return count;
  }

  async markMessagesAsRead(roomId: string): Promise<void> {
    const chatRoom = await this.prismaService.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      throw new Error('Chat room not found');
    }
    await this.prismaService.chatRoom.update({
      where: {
        id: chatRoom.id,
      },
      data: {
        unreadCount: 0,
      },
    });
  }
}
