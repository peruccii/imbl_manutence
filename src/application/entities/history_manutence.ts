import { Replace } from "@application/helpers/replace";
import { randomUUID } from "crypto";
import { User } from "./user";
import { Manutence } from "./manutence";
import { Role } from "@application/enums/role.enum";

export interface HistoryManutenceProps {
    data: Date
    action: string
    user?: User
    manutence: Manutence
    typeUser: Role
    occuredAt: Date
}


export class HistoryManutence {
     private props: HistoryManutenceProps;
     private _id: string;
   
     constructor(
       props: Replace<HistoryManutenceProps, { occuredAt?: Date; user?: User }>,
       id?: string,
     ) {
       this._id = id ?? randomUUID();
       this.props = {
         ...props,
         occuredAt: props.occuredAt ?? new Date(),
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

      public get user(): User {
        return this.user;
      }

      public set user(user: User) {
         this.props.user = user;
      }

      public get manutence(): Manutence {
        return this.manutence;
      }

      public set manutence(manutence: Manutence) {
         this.props.manutence = manutence;
      }

      public get typeUser(): Role {
        return this.typeUser;
      }

      public set typeUser(typeUser: Role) {
         this.props.typeUser = typeUser;
      }
}