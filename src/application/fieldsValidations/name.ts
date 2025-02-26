import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';
import { NAME_LENGTH_ERROR } from '@application/utils/constants';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

export class Name {
  private readonly name: string;

  public get value(): string {
    return this.name;
  }

  private validateNameLength(name: string): boolean {
    return name.length >= 5 && name.length <= 55;
  }

  constructor(name: string) {
    const isNameLengthValid = this.validateNameLength(name);

    if (!isNameLengthValid)
      throw new InternalServerErrorHandler(NAME_LENGTH_ERROR);

    this.name = name;
  }
}
