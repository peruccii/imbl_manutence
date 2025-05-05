import type { Replace } from '@application/helpers/replace';
import { randomUUID } from 'node:crypto';
import { User } from './user';

export interface ReportProps {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  manutenceId: string;
  title: string;
  description: string;
  user?: User;
}

export class Report {
  private props: ReportProps;
  private _id: string;
  constructor(props: Replace<ReportProps, { createdAt?: Date }>, id?: string) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
    this._id = id ?? randomUUID();
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get user() {
    return this.props.user;
  }

  public get userId() {
    return this.props.userId;
  }

  public get manutenceId() {
    return this.props.manutenceId;
  }

  public get description() {
    return this.props.description;
  }

  public get title() {
    return this.props.title;
  }

  public set title(title: string) {
    this.props.title = title;
  }

  public set description(description: string) {
    this.props.description = description;
  }

  public get id() {
    return this._id;
  }
}
