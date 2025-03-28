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
    await this.prismaService.message.create({
      data: {
        content: msg,
        senderId,
        chatRoomId: room.id,
      },
    });
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

  async findAdminChatRooms(adminId: string, pagination: Pagination): Promise<ChatRoom[] | null> {
    console.log('adminId', adminId);
    const chatRooms = await this.prismaService.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: adminId
          }
        },
        manutence: {
          OR: [
            {
              adminId: adminId
            },
            {
              userId: adminId
            }
          ]
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        manutence: {
          include: {
            user: true
          }
        },
        lastMessage: {
          include: {
            sender: true
          }
        }
      },
      skip: Number(pagination.skip),
      take: Number(pagination.limit),
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('chatRooms found:', chatRooms.length);
    console.log('First chatRoom:', JSON.stringify(chatRooms[0], null, 2));

    if (!chatRooms || chatRooms.length === 0) {
      throw new Error(`No chat rooms found for adminId: ${adminId}`);
    }

    return chatRooms.map(chatRoom => {
      try {
        return PrismaChatRoomMapper.toDomain(chatRoom);
      } catch (error) {
        console.error('Error mapping chatRoom:', error);
        console.error('chatRoom data:', JSON.stringify(chatRoom, null, 2));
        throw error;
      }
    });
  }
}
