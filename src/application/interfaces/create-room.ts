import { Message } from '@application/entities/message';
import type { RoomUser } from './room-users-interface';

export interface CreateChatRoomRequest {
  name: string;
  users: RoomUser[];
  messages: Message[];
}
