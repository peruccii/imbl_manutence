import { HistoryManutence } from '@application/entities/history_manutence';
import { UserViewModel } from './user-view-model';
import { ManutenceViewModel } from './manutence-view-model';

export class HistoryManutenceViewModel {
  static toGetFormatHttp(history: HistoryManutence) {
    return {
      id: history.id,
      action: history.action,
      data: history.data,
      usuario: history.usuario
        ? UserViewModel.toGetFormatHttp(history.usuario)
        : null,
      manutencao: history.manutencao
        ? ManutenceViewModel.toGetFormatHttp(history.manutencao)
        : null,
      typeUser: history.typeUser,
      occurredAt: history.occurredAt,
    };
  }
}
