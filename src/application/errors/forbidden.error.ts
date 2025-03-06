import { ForbiddenException, HttpStatus } from '@nestjs/common';

export class ForbiddenErrorHandler extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenErrorHandler';
  }

  error() {
    throw new ForbiddenException({
      status: HttpStatus.FORBIDDEN,
      code: 'FORBIDDEN_ERROR',
      message: this.message,
    });
  }
}
