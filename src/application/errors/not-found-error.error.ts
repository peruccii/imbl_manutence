import { HttpStatus, NotFoundException } from '@nestjs/common';

export class NotFoundErrorHandler extends Error {

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundErrorHandler';
  }

  error() {
    throw new NotFoundException(
      {
        status: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND_ERROR',
        message: this.message
      },
    );
  }
}
