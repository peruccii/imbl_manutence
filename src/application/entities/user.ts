import { randomUUID } from 'crypto';
import { Replace } from '../helpers/replace';
import { Email } from '../fieldsValidations/email';
import { Name } from '../fieldsValidations/name';
import { Telefone } from '../fieldsValidations/telefone';
import { Manutence } from './manutence';
import { Role } from '../enums/role.enum';
import { Password } from '@application/fieldsValidations/password';

export interface UserProps {
  name: Name;
  telephone: Telefone | null;
  email: Email;
  createdAt: Date;
  typeUser: Role;
  password: Password;
  manutences: Manutence[] | [];
}

export class User {
  private props: UserProps;
  private _id: string;

  constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
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
    return this.props.name;
  }

  public set name(name: Name) {
    this.props.name = name;
  }

  public get password(): Password {
    return this.props.password;
  }

  public set password(password: Password) {
    this.props.password = password;
  }

  public get email(): Email {
    return this.props.email;
  }

  public set email(email: Email) {
    this.props.email = email;
  }

  public get telephone(): Telefone | null {
    return this.props.telephone;
  }

  public set telephone(telephone: Telefone | null) {
    this.props.telephone = telephone;
  }

  public get typeUser(): Role {
    return this.props.typeUser;
  }

  public set typeUser(typeUser: Role) {
    this.props.typeUser = typeUser;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  public get manutences(): Manutence[] | [] {
    return this.props.manutences;
  }

  public set manutences(manutences: Manutence[] | []) {
    this.props.manutences = manutences;
  }
}
