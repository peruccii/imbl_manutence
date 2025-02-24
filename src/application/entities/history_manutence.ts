import { Replace } from '@application/helpers/replace';
import { randomUUID } from 'crypto';
import { User } from './user';
import { Manutence } from './manutence';
import { Role } from '@application/enums/role.enum';

export interface HistoryManutenceProps {
  data: Date;
  action: string;
  usuario: User;
  manutencao: Manutence;
  typeUser: Role;
  occurredAt: Date;
}

export class HistoryManutence {
  private props: HistoryManutenceProps;
  private _id: string;

  constructor(
    props: Replace<HistoryManutenceProps, { occuredAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      occurredAt: props.occuredAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get data(): Date {
    return this.data;
  }

  public set data(data: Date) {
    this.props.data = data;
  }

  public get action(): string {
    return this.action;
  }

  public set action(action: string) {
    this.props.action = action;
  }

  public get usuario(): User {
    return this.usuario;
  }

  public set usuario(usuario: User) {
    this.props.usuario = usuario;
  }

  public get manutencao(): Manutence {
    return this.manutencao;
  }

  public set manutencao(manutencao: Manutence) {
    this.props.manutencao = manutencao;
  }

  public get typeUser(): Role {
    return this.typeUser;
  }

  public set typeUser(typeUser: Role) {
    this.props.typeUser = typeUser;
  }

  public get occuredAt(): Date {
    return this.occuredAt;
  }

  public set occurredAt(occurredAt: Date) {
    this.props.occurredAt = occurredAt;
  }
}
