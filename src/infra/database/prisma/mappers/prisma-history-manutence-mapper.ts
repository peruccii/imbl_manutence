import { Manutence } from "@application/entities/manutence";
import { User } from "@application/entities/user";
import { Role } from "@application/enums/role.enum";
import { MANUTENCE_CREATED } from "@application/utils/constants";
import { randomUUID } from "crypto";

export interface IHistoryInterface {
    id: string
    action: string,
    data: Date,
    typeUser: Role
    manutencao: Manutence,
    usuario: User
    occurredAt: Date
}

export class PrismaHistoryManutenceMapper {
    static toPrisma(manutence_history: IHistoryInterface, id: string) {
        return {
            id: randomUUID(),
            action: MANUTENCE_CREATED,
            data: manutence_history.occurredAt,
            typeUser: manutence_history.usuario.typeUser,
            manutenceId: id,
            usuarioId: manutence_history.usuario.id
        }
    }
}