import { Message } from '@application/entities/message';
import { User } from '@application/entities/user';

export interface CreateChatRoomRequest {
  name: string;
  users: User[];
  messages: Message[];
}
