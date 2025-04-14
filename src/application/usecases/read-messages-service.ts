import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat-repository';

@Injectable()
export class ReadMessageService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(roomId: string) {
    const chatRoom = await this.chatRepository.findRoom(roomId);
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    await this.chatRepository.markMessagesAsRead(chatRoom.id);
  }
}
