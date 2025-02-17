import { HistoryManutence } from "@application/entities/history_manutence";
import { Manutence } from "@application/entities/manutence";
import { MANUTENCE_CREATED } from "@application/utils/constants";
import { randomUUID } from "crypto";

export class PrismaHistoryManutenceMapper {
    static toPrisma(manutence: HistoryManutence, id: string) {
        return {
            id: randomUUID(),
            action: MANUTENCE_CREATED,
            data: manutence.createdAt,
            typeUser: manutence.user.typeUser,
            manutenceId: id,
            usuarioId: manutence.user.id
        }
    }
}