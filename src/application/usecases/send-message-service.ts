import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat-repository';
import { Message } from '../entities/message';
import { randomUUID } from 'crypto';

interface SendMessageRequest {
  content: string;
  roomName: string;
  senderId: string;
  senderType: string;
}

@Injectable()
export class SendMessageService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(request: SendMessageRequest): Promise<void> {
    const { content, roomName, senderId, senderType } = request;

    const room = await this.chatRepository.findRoom(roomName);
    if (!room) {
      throw new Error('Sala não encontrada');
    }

    // Cria a mensagem
    const message = new Message(
      {
        content,
        senderId,
        chatRoomId: room.id,
        createdAt: new Date(),
        isRead: false,
        senderType: senderType,
      },
      randomUUID(),
    );

    // Salva a mensagem
    await this.chatRepository.createMessage(message);
  }
}
