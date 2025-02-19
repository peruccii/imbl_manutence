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
    const isTelefoneRegexValid = this.validateTelefoneRegex(telephone);

    if (!isTelefoneRegexValid) throw new Error('TELEFONE INVALID');

    this.telephone = telephone;
  }
}
