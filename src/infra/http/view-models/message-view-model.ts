import type { Message } from '@application/entities/message';

export class MessageViewModel {
  static toGetFormatHttp(message: Message) {
    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      isRead: message.isRead,
      senderId: message.senderId,
    };
  }
}
