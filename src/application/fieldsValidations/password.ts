import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';
import { PASSWORD_LENGTH_ERROR } from '@application/utils/constants';

export class Password {
  private readonly password: string;

  public get value(): string {
    return this.password;
  }

  private validatePasswordLength(password: string): boolean {
    return password.length >= 5 && password.length <= 55;
  }

  constructor(password: string) {
    this.password = password;
  }

  public validate(): string[] {
    const isHashed =
      this.password.startsWith('$2b$') && this.password.length === 60;
    const errors: string[] = [];
    if (!isHashed) {
      const isPasswordLengthValid = this.validatePasswordLength(this.password);
      if (!isPasswordLengthValid) {
        errors.push(PASSWORD_LENGTH_ERROR);
      }
    }
    return errors;
  }
}
