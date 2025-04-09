import { BadRequestException, HttpStatus } from '@nestjs/common';

export class BadRequestErrorHandler extends Error {
  private readonly messages: string[];

  constructor(messages: string | string[]) {
    const messageArray = Array.isArray(messages) ? messages : [messages];
    super(messageArray.join('; '));
    this.messages = messageArray;
    this.name = 'BadRequestErrorHandler';
  }

  getMessages(): string[] {
    return this.messages;
  }

  error() {
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      code: 'BAD_REQUEST',
      message: this.message,
    });
  }
}
