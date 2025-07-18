import { randomUUID } from 'crypto';
import { StatusManutence } from '../enums/StatusManutence';
import { Priority } from '../enums/Priority';
import { Message } from '../fieldsValidations/message';
import { Replace } from '../helpers/replace';
import { User } from './user';
import { HistoryManutence } from './history_manutence';
import { Specialty } from '../enums/Specialty';
import { Report } from './report';
export interface SpecialtyItem {
  name: Specialty;
}

export interface ManutenceProps {
  message: Message;
  title: string;
  photos: {
    fileName: string;
    signedUrl: string;
  }[];
  video: {
    fileName: string;
    signedUrl: string;
  }[];
  address: string;
  status_manutence: StatusManutence;
  createdAt: Date;
  userId: string;
  adminId?: string;
  chatRoomId?: string;
  priority?: Priority;
  user?: User;
  historico?: HistoryManutence;
  specialties: SpecialtyItem[];
  reports?: Report[];
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
      specialties: props.specialties ?? [],
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

  public get title(): string {
    return this.props.title;
  }

  public set title(title: string) {
    this.props.title = title;
  }

  public get address(): string {
    return this.props.address;
  }

  public set address(address: string) {
    this.props.address = address;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public set userId(userId: string) {
    this.props.userId = userId;
  }

  public get video(): {
    fileName: string;
    signedUrl: string;
  }[] {
    return this.props.video;
  }

  public set video(video: { fileName: string; signedUrl: string }[]) {
    this.props.video = video;
  }

  public get adminId(): string | null | undefined {
    return this.props.adminId;
  }

  public set adminId(adminId: string | undefined) {
    this.props.adminId = adminId;
  }

  public get photos(): { fileName: string; signedUrl: string }[] {
    return this.props.photos;
  }

  public set photos(photos: { fileName: string; signedUrl: string }[]) {
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

  public get reports(): Report[] {
    return this.props.reports ?? [];
  }

  public set reports(reports: Report[]) {
    this.props.reports = reports;
  }

  public get historico(): HistoryManutence | undefined {
    return this.props.historico;
  }

  public set historico(historico: HistoryManutence) {
    this.props.historico = historico;
  }

  public get chatRoomId(): string | undefined {
    return this.props.chatRoomId;
  }

  public set chatRoomId(chatRoomId: string) {
    this.props.chatRoomId = chatRoomId;
  }

  public get specialties(): SpecialtyItem[] {
    return this.props.specialties;
  }

  public set specialties(specialties: SpecialtyItem[]) {
    this.props.specialties = specialties;
  }

  public get priority(): Priority | undefined {
    return this.props.priority;
  }

  public set priority(priority: Priority | undefined) {
    this.props.priority = priority;
  }
}
