import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';

export class InternalServerErrorHandler extends Error {

  constructor(message: string) {
    super(message);
    this.name = 'InternalServerErrorHandler';
  }

  error() {
    throw new InternalServerErrorException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_SERVER_ERROR',
        message: this.message
      },
    );
  }
}
