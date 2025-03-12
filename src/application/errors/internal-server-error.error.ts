import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

export class InternalServerErrorHandler extends Error {
  private readonly messages: string[];

  constructor(messages: string | string[]) {
    const messageArray = Array.isArray(messages) ? messages : [messages];
    super(messageArray.join('; '));
    this.messages = messageArray;
    this.name = 'InternalServerErrorHandler';
  }

  getMessages(): string[] {
    return this.messages;
  }

  error() {
    throw new InternalServerErrorException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: this.message,
    });
  }
}
