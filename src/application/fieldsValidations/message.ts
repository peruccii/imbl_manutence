import  { ValidationErrorDetail } from '@application/errors/validation-error';
import { MESSAGE_LENGTH_ERROR } from '@application/utils/constants';

export class Message {
  private readonly message: string;

  public get value(): string {
    return this.message;
  }

  private validMessageLenght(message: string): boolean {
    return message.length >= 5 && message.length <= 255;
  }

  constructor(message: string) {
    this.message = message;
  }

  public validate(): ValidationErrorDetail[] {
    const isMessageLenghtValid = this.validMessageLenght(this.message);
    const errors: ValidationErrorDetail[] = [];
    if (!isMessageLenghtValid) errors.push({ field: 'message', message: MESSAGE_LENGTH_ERROR });

    return errors;
  }
}
