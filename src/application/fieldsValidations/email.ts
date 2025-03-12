import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';
import {
  EMAIL_FORMAT_INVALID,
  EMAIL_LENGTH_ERROR,
} from '@application/utils/constants';

export class Email {
  private readonly email: string;

  get value(): string {
    return this.email;
  }

  private validateEmailLength(email: string): boolean {
    return email.length >= 5 && email.length <= 55;
  }

  private validateEmailIsValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  constructor(email: string) {
    this.email = email;
  }

  public validate(): string[] {
    const errors: string[] = [];
    const isEmailLengthValid = this.validateEmailLength(this.email);
    const isEmailValid = this.validateEmailIsValid(this.email);

    if (!isEmailLengthValid) {
      errors.push(EMAIL_LENGTH_ERROR);
    }
    if (!isEmailValid) {
      errors.push(EMAIL_FORMAT_INVALID);
    }

    return errors;
  }
}
