import { ActionHistory } from '../enums/action.enum';
import { HistoryManutence } from '../entities/history_manutence';
import { Pagination } from '../interfaces/pagination';

export abstract class HistoryManutenceRepository {
  abstract createHistoryEntry(data: {
    id: string;
    action: ActionHistory;
    data: Date;
    usuarioId: string;
    manutenceId: string;
  }): Promise<void>;

  abstract findMany(pagination: Pagination): Promise<HistoryManutence[]>;

  abstract findByManutenceId(
    manutenceId: string,
    pagination: Pagination,
  ): Promise<HistoryManutence[]>;
}
