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
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'NAME LENGTH MUST BE AT LEAST 5 CHARACTERES',
      });
    ('NAME LENGTH INVALID');

    this.name = name;
  }
}
