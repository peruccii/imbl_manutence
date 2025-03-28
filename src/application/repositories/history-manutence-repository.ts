import { ActionHistory } from '../enums/action.enum';

export abstract class HistoryManutenceRepository {
  abstract createHistoryEntry(data: {
    id: string;
    action: ActionHistory;
    data: Date;
    usuarioId: string;
    manutenceId: string;
  }): Promise<void>;
} 