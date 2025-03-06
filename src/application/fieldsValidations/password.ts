import { InternalServerErrorHandler } from "@application/errors/internal-server-error.error";
import { PASSWORD_LENGTH_ERROR } from "@application/utils/constants";

export class Password {
    private readonly password: string;
  
    public get value(): string {
      return this.password;
    }
  
    private validatePasswordLength(password: string): boolean {
      return password.length >= 5 && password.length <= 55;
    }
  
    constructor(password: string) {
      const isHashed = password.startsWith('$2b$') && password.length === 60;
  
      if (!isHashed) {
        const isPasswordLengthValid = this.validatePasswordLength(password);
        if (!isPasswordLengthValid) {
          throw new InternalServerErrorHandler(PASSWORD_LENGTH_ERROR);
        }
      }
  
      this.password = password;
    }
  }
  