import { ChatRoom } from '@application/entities/chat_room';
import { ChatRepository } from '@application/repositories/chat-repository';
import { PrismaService } from '../prisma.service';
import { RoomNotFoundError } from '@application/errors/room-not-found.error';
import { RoomNotFoundMessage } from '@application/messages/room-not-found';
import { Pagination } from '@application/interfaces/pagination';
import { PrismaChatRoomMapper } from '../mappers/prisma-chat-mapper';
import { SendMessageInterface } from '@application/interfaces/send-message';
import { CreateChatRoomRequest } from '@application/interfaces/create-room';
import { PrismaCreateRoomMapper } from '../mappers/prisma-create-room-mapper';

export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pagination: Pagination): Promise<ChatRoom[] | []> {
    throw new Error('Method not implemented.');
  }
  async findAllWithMessages(pagination: Pagination): Promise<ChatRoom[] | []> {
    throw new Error('Method not implemented.');
  }

  async sendMessage(send_request: SendMessageInterface): Promise<void> {
    const { senderId, roomName, msg } = send_request;

    const room = await this.findRoom(roomName);

    if (!room) {
      throw new RoomNotFoundError(RoomNotFoundMessage);
    }

    const roomId = room.id;

    const raw = PrismaChatRoomMapper.toPrisma(msg, senderId, roomId);

    await this.prismaService.message.create({
      data: raw,
    });
  }

  async findRoom(roomName: string): Promise<ChatRoom | null> {
    const room = await this.prismaService.chatRoom.findFirst({
      where: { name: roomName },
      include: {
        users: true,
        messages: true,
      },
    });

    if (!room) {
      return null;
    }

    return PrismaChatRoomMapper.toDomain(room);
  }

  async createRoom(createRoomRequest: CreateChatRoomRequest): Promise<void> {
    const raw = PrismaCreateRoomMapper.toPrisma(createRoomRequest);
    await this.prismaService.chatRoom.create({
      data: raw,
    });
  }
}
