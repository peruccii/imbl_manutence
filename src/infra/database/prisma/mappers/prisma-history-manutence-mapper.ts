import { Manutence } from "@application/entities/manutence";
import { ActionHistory } from "@application/enums/action.enum";


export class PrismaHistoryManutenceMapper {
    static toPrisma(action: ActionHistory, manutence: Manutence, id: string) {
        return {
            id: id,
            action: action,
            data: manutence.createdAt,
            manutencao: {
                connect: { id: id }
            },
            usuario: {
                connect: { id: manutence.userId }
            }
        }
    }
}