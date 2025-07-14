import { Injectable } from '@nestjs/common';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { Priority } from '@application/enums/Priority';
import { StatusManutence } from '@application/enums/StatusManutence';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';

export interface UpdatePriorityRequest {
  manutenceId: string;
  priority: Priority;
}

@Injectable()
export class UpdatePriorityService {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(request: UpdatePriorityRequest): Promise<void> {
    const { manutenceId, priority } = request;

    // Check if maintenance exists
    const manutence = await this.manutenceRepository.find(manutenceId);
    if (!manutence) {
      throw new NotFoundErrorHandler('Manutenção não encontrada');
    }

    // Check if maintenance is accepted (has adminId and status is not NOVO)
    if (!manutence.adminId || manutence.status_manutence === StatusManutence.NOVO) {
      throw new Error('Prioridade só pode ser definida após a manutenção ser aceita');
    }

    // Update priority
    await this.manutenceRepository.update(manutenceId, {
      priority,
    });
  }
}
