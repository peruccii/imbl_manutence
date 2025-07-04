export interface NotificationProps {
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  manutenceId?: string;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export class Notification {
  private props: NotificationProps;

  constructor(props: NotificationProps, public readonly id?: string) {
    this.props = {
      ...props,
      isRead: props.isRead ?? false,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get title(): string {
    return this.props.title;
  }

  public get message(): string {
    return this.props.message;
  }

  public get type(): NotificationType {
    return this.props.type;
  }

  public get isRead(): boolean {
    return this.props.isRead;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get manutenceId(): string | undefined {
    return this.props.manutenceId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get readAt(): Date | undefined {
    return this.props.readAt;
  }

  public markAsRead(): void {
    this.props.isRead = true;
    this.props.readAt = new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
