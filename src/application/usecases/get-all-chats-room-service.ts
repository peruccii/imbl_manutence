import { ChatRepository } from '@application/repositories/chat-repository';
import { Pagination } from '@application/interfaces/pagination';

export class GetAllChatsRoomService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(paginaton: Pagination) {
    const chats = await this.chatRepository.findAll(paginaton);

    return { chats };
  }
}
