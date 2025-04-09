import { ActionHistory } from '../enums/action.enum';
import { HistoryManutence } from '../entities/history_manutence';
import { Pagination } from '../interfaces/pagination';
import type { ManutenceHistoryObjectInterface } from '@application/interfaces/manutence-history-object';

export abstract class HistoryManutenceRepository {
  abstract createHistoryEntry(data: {
    id: string;
    action: ActionHistory;
    data: Date;
    usuarioId: string;
    manutenceId: string;
    manutencao: ManutenceHistoryObjectInterface;
  }): Promise<void>;

  abstract findMany(pagination: Pagination): Promise<HistoryManutence[]>;

  abstract findByManutenceId(
    manutenceId: string,
    pagination: Pagination,
  ): Promise<HistoryManutence[]>;
}
