import { Pagination } from '@application/interfaces/pagination';
import { ChatRepository } from '@application/repositories/chat-repository';

export class GetAllChatsRoomWithMessageService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(pagination: Pagination) {
    const chats = await this.chatRepository.findAllWithMessages(pagination);

    return { chats };
  }
}
