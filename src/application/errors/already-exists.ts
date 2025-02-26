import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

export class UnprocessableEntityErrorHandler extends Error {

  constructor(message: string) {
    super(message);
    this.name = 'AlreadyExistsErrorHandler';
  }

  error() {
    throw new UnprocessableEntityException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        code: 'UNPROCESSABLE_ENTITY_ERROR',
        message: this.message
      },
    );
  }
}
