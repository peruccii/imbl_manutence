import { HttpException, HttpStatus } from '@nestjs/common';

export class DefaultSetupError extends Error {
  httpStatus: HttpStatus;

  constructor(message: string) {
    super(message);
    this.name = 'De faultSetupError';
  }

  error() {
    throw new HttpException(
      {
        status: this.httpStatus,
        error: this.message,
      },
      this.httpStatus,
    );
  }
}
