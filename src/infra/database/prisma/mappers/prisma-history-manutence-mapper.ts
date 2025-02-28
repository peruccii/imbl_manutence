import { Manutence } from '@application/entities/manutence';
import { ActionHistory } from '@application/enums/action.enum';

export class PrismaHistoryManutenceMapper {
  static toPrisma(
    action: ActionHistory,
    manutence: Manutence,
    userId: string,
    createdManutenceId: string,
  ) {
    return {
      id: createdManutenceId,
      action: action,
      data: manutence.createdAt,
      manutencao: {
        connect: { id: createdManutenceId },
      },
      usuario: {
        connect: { id: userId },
      },
    };
  }
}
