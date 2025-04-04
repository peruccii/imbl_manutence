import { Message } from '@application/entities/message';
import type { RoomUser } from './room-users-interface';

export interface CreateChatRoomRequest {
  id: string;
  name: string;
  users: RoomUser[];
  messages: Message[];
}
