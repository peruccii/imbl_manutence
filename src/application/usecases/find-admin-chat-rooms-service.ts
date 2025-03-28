import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat-repository';
import { Pagination } from '@application/interfaces/pagination';

interface FindAdminChatRoomsRequest {
  adminId: string;
  pagination: Pagination;
}

@Injectable()
export class FindAdminChatRoomsService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({ adminId, pagination }: FindAdminChatRoomsRequest) {
    const chatRooms = await this.chatRepository.findAdminChatRooms(adminId, pagination);
    return chatRooms;
  }
} 