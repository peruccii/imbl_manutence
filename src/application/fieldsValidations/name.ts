import  { ValidationErrorDetail } from '@application/errors/validation-error';
import { NAME_LENGTH_ERROR } from '@application/utils/constants';

export class Name {
  private readonly name: string;

  public get value(): string {
    return this.name;
  }

  private validateNameLength(name: string): boolean {
    return name.length >= 5 && name.length <= 55;
  }

  constructor(name: string) {
    this.name = name;
  }

  public validate(): ValidationErrorDetail[] {
    const isNameLengthValid = this.validateNameLength(this.name);
    const errors: ValidationErrorDetail[] = [];

    if (!isNameLengthValid) errors.push({ field: 'name', message: NAME_LENGTH_ERROR });

    return errors;
  }
}
