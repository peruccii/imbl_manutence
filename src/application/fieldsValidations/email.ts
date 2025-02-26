import { InternalServerErrorHandler } from "@application/errors/internal-server-error.error";
import { EMAIL_FORMAT_INVALID, EMAIL_LENGTH_ERROR } from "@application/utils/constants";

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
    const isEmailLengthValid = this.validateEmailLength(email);
    const isEmailValid = this.validateEmailIsValid(email);

    if (!isEmailLengthValid) throw new InternalServerErrorHandler(EMAIL_LENGTH_ERROR); 
    if (!isEmailValid) throw new InternalServerErrorHandler(EMAIL_FORMAT_INVALID);

    this.email = email;
  }
}
