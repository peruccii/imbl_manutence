import { Replace } from '@application/helpers/replace';

export interface MessageProps {
  content: string;
  createdAt: Date;
  senderId: string;
  chatRoomId: string;
  isRead: boolean;
  senderType: string;
}

export class Message {
  private props: MessageProps;
  private _id?: string;

  constructor(props: Replace<MessageProps, { createdAt?: Date }>, id?: string) {
    this._id = id;
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string | undefined {
    return this._id;
  }

  public set id(value: string | undefined) {
    this._id = value;
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

  public get isRead(): boolean {
    return this.props.isRead;
  }

  public set isRead(isRead: boolean) {
    this.props.isRead = isRead;
  }

  public get senderType(): string {
    return this.props.senderType;
  }

  public set senderType(senderType: string) {
    this.props.senderType = senderType;
  }
}
