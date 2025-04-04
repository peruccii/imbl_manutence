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

    // TODO: chat room id must be the same id as manutence id
    if (!manutenceRaw) throw new NotFoundErrorHandler(ManutenceNotFoundMessage); 

    return PrismaManutenceMapper.toDomain(manutenceRaw);
  }

  async sendMessage(request: SendMessageInterface): Promise<void> {
    const { msg, roomName, senderId } = request;
    const room = await this.prismaService.chatRoom.findFirst({
      where: { name: roomName },
    });
    if (!room) throw new Error('Sala não encontrada');
    
    // Criar a mensagem usando o método createMessage
    const message = new Message(
      {
        content: msg,
        senderId,
        chatRoomId: room.id,
        createdAt: new Date(),
        isRead: false,
      }
    );
    
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
          OR: [
            { adminId: adminId },
            { userId: adminId }
          ]
        }
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
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

    return chatRooms
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
            createdAt: 'desc',
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

    return chatRooms
  }

  async createMessage(message: Message): Promise<void> {
    console.log('Criando mensagem:', message);
    console.log('messageId', message.id);
  
    try {
      // Verificar se o ChatRoom existe
      const chatRoom = await this.prismaService.chatRoom.findUnique({
        where: { id: message.chatRoomId },
      });
  
      if (!chatRoom) {
        throw new Error('Chat room não encontrado!');
      }
  
      // Verificar se o senderId (usuário) existe
      const sender = await this.prismaService.user.findUnique({
        where: { id: message.senderId },
      });
  
      if (!sender) {
        throw new Error('Usuário não encontrado!');
      }
  
      // Criar a mensagem sem passar o id (deixe o Prisma gerar o id automaticamente)
      const createdMessage = await this.prismaService.message.create({
        data: {
          content: message.content,
          senderId: message.senderId,
          chatRoomId: message.chatRoomId,
          createdAt: message.createdAt,
          isRead: message.isRead,
        },
      });
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      throw error;
    }
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

  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    await this.prismaService.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
