import { randomUUID } from 'crypto';
import { Replace } from '../helpers/replace';
import { Email } from '../fieldsValidations/email';
import { Name } from '../fieldsValidations/name';
import { Telefone } from '../fieldsValidations/telefone';
import { Manutence } from './manutence';
import { Role } from '../enums/role.enum';

export interface UserProps {
  name: Name;
  telefone: Telefone | null;
  email: Email;
  createdAt: Date;
  typeUser: Role;
  password: string;
  manutences: Manutence[];
}

export class User {
  private props: UserProps;
  private _id: string;

  constructor(props: Replace<UserProps, { createdAt?: Date, password: string }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get name(): Name {
    return this.name;
  }

  public set name(name: Name) {
    this.props.name = name;
  }

  public get password(): string {
    return this.password;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get email(): Email {
    return this.email;
  }

  public set email(email: Email) {
    this.props.email = email;
  }

  public get telefone(): Telefone | null {
    return this.telefone;
  }

  public set telefone(telefone: Telefone | null) {
    this.props.telefone = telefone;
  }

  public get typeUser(): Role {
    return this.typeUser;
  }

  public set typeUser(typeUser: Role) {
    this.props.typeUser = typeUser;
  }

  public get createdAt(): Date {
    return this.createdAt;
  }

  public set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  public get manutences(): Manutence[] {
    return this.manutences;
  }

  public set manutences(manutences: Manutence[]) {
    this.props.manutences = manutences;
  }
}
