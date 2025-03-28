import { ChatRoom } from '@application/entities/chat_room';
import { Manutence } from '@application/entities/manutence';
import { CreateChatRoomRequest } from '@application/interfaces/create-room';
import { Pagination } from '@application/interfaces/pagination';
import { RoomUser } from '@application/interfaces/room-users-interface';
import { SendMessageInterface } from '@application/interfaces/send-message';

export abstract class ChatRepository {
  abstract findRoom(roomName: string): Promise<ChatRoom | null>;
  abstract findManutenceByChatRoom(
    chatRoomId: string,
  ): Promise<Manutence | null>;
  abstract getUsersInRoom(roomName: string): Promise<RoomUser[]>;
  abstract createRoom(request: CreateChatRoomRequest): Promise<void>;
  abstract sendMessage(request: SendMessageInterface): Promise<void>;
  abstract findAll(pagination: Pagination): Promise<ChatRoom[] | []>;
  abstract findAllWithMessages(
    pagination: Pagination,
  ): Promise<ChatRoom[] | []>;
  abstract findAdminChatRooms(adminId: string, pagination: Pagination): Promise<ChatRoom[] | null>;
}
