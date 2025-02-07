import { randomUUID } from "crypto"
import { Replace } from "../helpers/replace"
import { Email } from "../fieldsValidations/email"
import { Name } from "../fieldsValidations/name"
import { Telefone } from "../fieldsValidations/telefone"
import { userType } from "../enums/userType"
import { Manutence } from "./manutence"

export interface UserProps {
    name: Name
    telefone: Telefone | null
    email: Email
    createdAt: Date
    userType: userType
    password: string
    manutence: Manutence[]
}

export class User {
    private props: UserProps
    private _id: string

    constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
        this._id = id ?? randomUUID();
        this.props = {
          ...props,
          createdAt: props.createdAt ?? new Date(),
        };
    }

    public get id(): string {
        return this._id
    }

    public get name(): Name {
        return this.name
    }

    public set name(name: Name) {
        this.props.name = name
    }

    
    public get password(): string {
        return this.password
    }

    public set password(password: string) {
        this.props.password = password
    }

    public get email(): Email {
        return this.email
    }

    public set email(email: Email) {
        this.props.email = email
    }

    public get telefone(): Telefone | null {
        return this.telefone
    }

    public set telefone(telefone: Telefone | null)  {
        this.props.telefone = telefone
    }

    public get userType(): userType {
        return this.userType
    }

    public set userType(userType: userType) {
        this.props.userType = userType
    }
}