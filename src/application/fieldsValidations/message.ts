import { InternalServerErrorHandler } from "@application/errors/internal-server-error.error";
import { MESSAGE_LENGTH_ERROR } from "@application/utils/constants";

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

    if (!isMessageLenghtValid) throw new InternalServerErrorHandler(MESSAGE_LENGTH_ERROR); 

    this.message = message;
  }
}
