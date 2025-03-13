import { HttpStatus, BadRequestException } from '@nestjs/common';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  private readonly errors: ValidationErrorDetail[];

  constructor(errors: ValidationErrorDetail | ValidationErrorDetail[]) {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    super('Validation failed');
    this.errors = errorArray;
    this.name = 'ValidationError';
  }

  getErrors(): ValidationErrorDetail[] {
    return this.errors;
  }

  throw() {
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
      errors: this.errors,
    });
  }
}