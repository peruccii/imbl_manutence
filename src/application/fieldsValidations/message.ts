import { InternalServerErrorHandler } from '@application/errors/internal-server-error.error';
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
    const isMessageLenghtValid = this.validMessageLenght(message);
    const errors: string[] = [];
    if (!isMessageLenghtValid) errors.push(MESSAGE_LENGTH_ERROR);

    if (errors.length > 0) {
      throw new InternalServerErrorHandler(errors);
    }

    this.message = message;
  }

  public validate(): string[] {
    const isMessageLenghtValid = this.validMessageLenght(this.message);
    const errors: string[] = [];
    if (!isMessageLenghtValid) errors.push(MESSAGE_LENGTH_ERROR);

    return errors;
  }
}
