export class Password {
    private readonly password: string;
  
    public get value(): string {
      return this.password;
    }
  
    private validatePasswordLength(password: string): boolean {
      return password.length >= 5 && password.length <= 55;
    }
  
    constructor(password: string) {
      const isPasswordLengthValid = this.validatePasswordLength(password);
  
      if (!isPasswordLengthValid) throw new Error('PASSWORD LENGTH INVALID');
  
      this.password = password;
    }
  }
  