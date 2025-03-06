import { Pagination } from '@application/interfaces/pagination';
import { ChatRepository } from '@application/repositories/chat-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllChatsRoomWithMessageService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(pagination: Pagination) {
    const chats = await this.chatRepository.findAllWithMessages(pagination);

    return { chats };
  }
}
