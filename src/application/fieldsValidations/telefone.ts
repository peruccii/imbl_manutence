import  { ValidationErrorDetail } from '@application/errors/validation-error';
import { TELEFONE_FORMAT_ERROR } from '@application/utils/constants';

export class Telefone {
  private readonly telephone: string;

  public get value(): string {
    return this.telephone;
  }

  private validateTelefoneRegex(telefone: string): boolean {
    const telefoneRegex = /^(?:\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5})-?(\d{4})$/;
    return telefoneRegex.test(telefone);
  }

  constructor(telephone: string) {
    this.telephone = telephone;
  }

  public validate(): ValidationErrorDetail[] {
    const isTelefoneRegexValid = this.validateTelefoneRegex(this.telephone);
    const errors: ValidationErrorDetail[] = [];
    if (!isTelefoneRegexValid) errors.push({field: 'telephone', message: TELEFONE_FORMAT_ERROR});

    return errors;
  }
}
