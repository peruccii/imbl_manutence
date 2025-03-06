import { randomUUID } from 'crypto';
import { StatusManutence } from '../enums/StatusManutence';
import { Message } from '../fieldsValidations/message';
import { Replace } from '../helpers/replace';
import { User } from './user';
import { HistoryManutence } from './history_manutence';
import type { p } from '@application/interfaces/photos';

export interface ManutenceProps {
  message: Message;
  photos: p[];
  video: string;
  status_manutence: StatusManutence;
  createdAt: Date;
  userId: string;
  user?: User;
  historico?: HistoryManutence
}

export class Manutence {
  private props: ManutenceProps;
  private _id: string;

  constructor(
    props: Replace<ManutenceProps, { createdAt?: Date; user?: User }>,
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
    return this.props.message;
  }

  public set message(message: Message) {
    this.props.message = message;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public set userId(userId: string) {
    this.props.userId = userId;
  }

  public get video(): string {
    return this.props.video;
  }

  public set video(video: string) {
    this.props.video = video;
  }

  public get photos(): p[] {
    return this.props.photos;
  }

  public set photos(photos: p[]) {
    this.props.photos = photos;
  }

  public get status_manutence(): StatusManutence {
    return this.props.status_manutence;
  }

  public set status_manutence(status_manutence: StatusManutence) {
    this.props.status_manutence = status_manutence;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get user(): User | undefined {
    return this.props.user;
  }

  public set user(user: User) {
    this.props.user = user;
  }

  public get historico(): HistoryManutence | undefined {
    return this.props.historico;
  }

  public set historico(historico: HistoryManutence) {
    this.props.historico = historico;
  }
}
