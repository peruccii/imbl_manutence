export class Cpf {
  private readonly cpf: string;

  public get value(): string {
    return this.cpf;
  }

  private validateCpf(cpf: string) {
    if (!cpf) {
      throw new Error('CPF is required');
    }

    if (cpf.length !== 11) {
      throw new Error('CPF must be 11 digits');
    }

    if (cpf.match(/(\d)\1{10}/)) {
      throw new Error('CPF is invalid');
    }
  }

  constructor(cpf: string) {
    this.validateCpf(cpf);
    this.cpf = cpf;
  }
}
