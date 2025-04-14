import { ChatRepository } from '@application/repositories/chat-repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetMessagesByRoomNameService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(roomName: string) {
    const room = await this.chatRepository.findRoom(roomName);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const messages = await this.chatRepository.findMessagesByRoomName(roomName);
    return messages;
  }
}
