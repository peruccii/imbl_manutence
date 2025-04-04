import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat-repository';
import { Pagination } from '@application/interfaces/pagination';

interface FindUserChatRoomsRequest {
    userId: string;
  pagination: Pagination;
}

@Injectable()
export class FindUserChatRoomsService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({ userId, pagination }: FindUserChatRoomsRequest) {
    const chatRooms = await this.chatRepository.findUserChatRooms(userId, pagination);
    return chatRooms;
  }
} 