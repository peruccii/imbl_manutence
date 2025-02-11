import { randomUUID } from 'crypto';
import { StatusManutence } from '../enums/StatusManutence';
import { Message } from '../fieldsValidations/message';
import { Replace } from '../helpers/replace';
import { User } from './user';

export interface ManutenceProps {
  message: Message;
  photos: string[];
  video: string;
  status_manutence: StatusManutence;
  createdAt: Date;
  client: User;
}

export class Manutence {
  private props: ManutenceProps;
  private _id: string;

  constructor(
    props: Replace<ManutenceProps, { createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get message(): Message {
    return this.message;
  }

  public set message(message: Message) {
    this.props.message = message;
  }

  public get video(): string {
    return this.video;
  }

  public set video(video: string) {
    this.props.video = video;
  }

  public get photos(): string[] {
    return this.photos;
  }

  public set photos(photos: string[]) {
    this.props.photos = photos;
  }

  public get status_manutence(): StatusManutence {
    return this.status_manutence;
  }

  public set status_manutence(status_manutence: StatusManutence) {
    this.props.status_manutence = status_manutence;
  }

  public get createdAt(): Date {
    return this.createdAt;
  }

  public get client(): User {
    return this.client;
  }

  public set client(client: User) {
    this.props.client = client;
  }
}
