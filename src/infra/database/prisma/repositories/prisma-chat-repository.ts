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

export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(pagination: Pagination): Promise<ChatRoom[] | []> {
    throw new Error('Method not implemented.');
  }
  async findAllWithMessages(pagination: Pagination): Promise<ChatRoom[] | []> {
    throw new Error('Method not implemented.');
  }

  async findManutenceByChatRoom(chatRoomId: string): Promise<Manutence | null> {
    return this.prismaService.manutence.findFirst({
      where: { chatRoomId },
    });
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
}
