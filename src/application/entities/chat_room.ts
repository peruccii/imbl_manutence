import { Replace } from '@application/helpers/replace';
import { randomUUID } from 'crypto';
import { User } from './user';
import { Message } from './message';
import { Manutence } from './manutence';

export interface ChatRoomProps {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  messages: Message[];
  manutence?: Manutence;
  lastMessage?: Message;
  unreadCount: number;
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
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public set messages(messages: Message[]) {
    this.props.messages = messages;
  }

  public get messages(): Message[] {
    return this.props.messages;
  }

  public set users(users: User[]) {
    this.props.users = users;
  }

  public get users(): User[] {
    return this.props.users;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get manutence(): Manutence | undefined {
    return this.props.manutence;
  }

  public set manutence(manutence: Manutence | undefined) {
    this.props.manutence = manutence;
  }

  public get lastMessage(): Message | undefined {
    return this.props.lastMessage;
  }

  public set lastMessage(lastMessage: Message | undefined) {
    this.props.lastMessage = lastMessage;
  }

  public get unreadCount(): number {
    return this.props.unreadCount;
  }

  public set unreadCount(unreadCount: number) {
    this.props.unreadCount = unreadCount;
  }
}
