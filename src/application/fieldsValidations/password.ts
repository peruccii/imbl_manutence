import  { ValidationErrorDetail } from '@application/errors/validation-error';
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

  public validate(): ValidationErrorDetail[] {
    const isHashed =
      this.password.startsWith('$2b$') && this.password.length === 60;
    const errors: ValidationErrorDetail[] = [];
    if (!isHashed) {
      const isPasswordLengthValid = this.validatePasswordLength(this.password);
      if (!isPasswordLengthValid) {
        errors.push({ field: 'password', message: PASSWORD_LENGTH_ERROR });
      }
    }
    return errors;
  }
}
