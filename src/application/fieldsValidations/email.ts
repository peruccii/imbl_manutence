import { ValidationErrorDetail } from '@application/errors/validation-error';
import {
  EMAIL_FORMAT_INVALID,
  EMAIL_LENGTH_ERROR,
} from '@application/utils/constants';

export class Email {
  private readonly email: string;

  public get value(): string {
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

  public validate(): ValidationErrorDetail[] {
    const errors: ValidationErrorDetail[] = [];
    const isEmailLengthValid = this.validateEmailLength(this.email);
    const isEmailValid = this.validateEmailIsValid(this.email);

    if (!isEmailLengthValid)
      errors.push({ field: 'email', message: EMAIL_LENGTH_ERROR });

    if (!isEmailValid)
      errors.push({ field: 'email', message: EMAIL_FORMAT_INVALID });

    return errors;
  }
}
