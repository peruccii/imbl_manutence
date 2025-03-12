import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';
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

  public validate(): string[] {
    const isNameLengthValid = this.validateNameLength(this.name);
    const errors: string[] = [];

    if (!isNameLengthValid) errors.push(NAME_LENGTH_ERROR);

    return errors;
  }
}
