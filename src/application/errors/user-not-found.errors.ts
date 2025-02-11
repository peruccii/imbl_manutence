import { HttpException, HttpStatus } from '@nestjs/common';
import { DefaultSetupError } from './default-setup';

export class UserNotFoundError extends DefaultSetupError {
  constructor(message: string) {
    super(message);
    this.httpStatus = HttpStatus.NOT_FOUND;
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
