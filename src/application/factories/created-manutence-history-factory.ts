import { HistoryManutence } from "@application/entities/history_manutence"
import { Manutence } from "@application/entities/manutence"
import { IHistoryInterface } from "@infra/database/prisma/mappers/prisma-history-manutence-mapper"

type Override = IHistoryInterface
type Raw = Manutence

export function makeCreatedManutenceHistory(override: Override, raw: Raw) {
    return new HistoryManutence({
        action: override.action,
        data: override.data,
        manutence: override.manutencao,
        typeUser: override.typeUser,
        occuredAt: override.occurredAt,
        user: override.usuario
    })
}