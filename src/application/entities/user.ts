import { randomUUID } from 'crypto';
import { Replace } from '../helpers/replace';
import { Email } from '../fieldsValidations/email';
import { Name } from '../fieldsValidations/name';
import { Telefone } from '../fieldsValidations/telefone';
import { Manutence } from './manutence';
import { Role } from '../enums/role.enum';
import { Password } from '@application/fieldsValidations/password';
import { StatusManutence } from '../enums/StatusManutence';
import type { Cpf } from '@application/fieldsValidations/cpf';

export interface UserStats {
  total: number;
  inProgress: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export interface UserProps {
  name: Name;
  telephone: Telefone;
  cpf: Cpf;
  address: string;
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

  public get cpf(): Cpf {
    return this.props.cpf;
  }

  public set cpf(cpf: Cpf) {
    this.props.cpf = cpf;
  }

  public get password(): Password {
    return this.props.password;
  }

  public get address(): string {
    return this.props.address;
  }

  public set address(address: string) {
    this.props.address = address;
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

  public get telephone(): Telefone {
    return this.props.telephone;
  }

  public set telephone(telephone: Telefone) {
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

  public getStats(): UserStats {
    const manutences = this.props.manutences;
    const total = manutences.length;
    const inProgress = manutences.filter(
      (m) => m.status_manutence === StatusManutence.ANDAMENTO,
    ).length;
    const completed = manutences.filter(
      (m) => m.status_manutence === StatusManutence.FINALIZADO,
    ).length;
    const pending = manutences.filter(
      (m) => m.status_manutence === StatusManutence.ANDAMENTO,
    ).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      inProgress,
      completed,
      pending,
      completionRate: Number(completionRate.toFixed(1)),
    };
  }
}
