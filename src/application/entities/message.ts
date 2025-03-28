import { Replace } from '@application/helpers/replace';
import { randomUUID } from 'crypto';

export interface MessageProps {
  content: string;
  createdAt: Date;
  senderId: string;
  chatRoomId: string;
  isRead: boolean;
}

export class Message {
  private props: MessageProps;
  private _id: string;

  constructor(props: Replace<MessageProps, { occuredAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get content(): string {
    return this.props.content;
  }

  public set content(content: string) {
    this.props.content = content;
  }

  public get senderId(): string {
    return this.props.senderId;
  }

  public set senderId(senderId: string) {
    this.props.senderId = senderId;
  }

  public get chatRoomId(): string {
    return this.props.chatRoomId;
  }

  public set chatRoomId(chatRoomId: string) {
    this.props.chatRoomId = chatRoomId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
