import { ChatRoom } from '@application/entities/chat_room';
import { CreateChatRoomRequest } from '@application/interfaces/create-room';
import { Pagination } from '@application/interfaces/pagination';
import { SendMessageInterface } from '@application/interfaces/send-message';
import type { UsersInRoom } from '@application/interfaces/users-in-room';

export abstract class ChatRepository {
  abstract sendMessage(send_request: SendMessageInterface): Promise<void>;
  abstract findRoom(roomName: string): Promise<ChatRoom | null>;
  abstract createRoom(createRoomRequest: CreateChatRoomRequest): Promise<void>;
  abstract findAll(pagination: Pagination): Promise<ChatRoom[] | []>;
  abstract getUsersInRoom(roomName: string): Promise<UsersInRoom[]>
  abstract findAllWithMessages(
    pagination: Pagination,
  ): Promise<ChatRoom[] | []>;
}
