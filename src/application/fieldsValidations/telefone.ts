export class Telefone {
    private readonly telefone: string

    public get value(): string {
        return this.telefone
    }

    private validateTelefoneRegex(telefone: string): boolean {
        const telefoneRegex = /^(?:\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5})-?(\d{4})$/;
        return telefoneRegex.test(telefone)
    }

    constructor(telefone: string) {
        const isTelefoneRegexValid = this.validateTelefoneRegex(telefone)

        if (!isTelefoneRegexValid) throw new Error()

        this.telefone = telefone
    }
}