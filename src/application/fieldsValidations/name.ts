export class Name {
    private readonly name: string

    public get value(): string {
        return this.name
    }

    private validateNameLength(name: string): boolean {
        return name.length >= 5 && name.length <= 55;
    }

    constructor(name: string) {
        const isNameLengthValid = this.validateNameLength(name)

        if (!isNameLengthValid) throw new Error()

        this.name = name
    }
}