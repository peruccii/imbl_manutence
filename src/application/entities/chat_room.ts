import { Replace } from '@application/helpers/replace';
import { randomUUID } from 'crypto';
import { User } from './user';
import { Message } from './message';

export interface ChatRoomProps {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  messages: Message[];
}

export class ChatRoom {
  private props: ChatRoomProps;
  private _id: string;

  constructor(
    props: Replace<ChatRoomProps, { createdAt?: Date; updatedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public set messages(messages: Message[]) {
    this.props.messages = messages;
  }

  public get messages(): Message[] {
    return this.messages;
  }

  public set users(users: User[]) {
    this.props.users = users;
  }

  public get users(): User[] {
    return this.users;
  }

  public get createdAt(): Date {
    return this.createdAt;
  }

  public get updatedAt(): Date {
    return this.updatedAt;
  }
}
