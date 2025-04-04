import { Injectable } from '@nestjs/common';
import { ChatRepository } from '@application/repositories/chat-repository';
import { Message } from '@application/entities/message';

@Injectable()
export class CreateMessageService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(message: Message): Promise<void> {
    await this.chatRepository.createMessage(message);
  }
} 