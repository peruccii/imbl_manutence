import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { StatusManutence } from '../enums/StatusManutence';
import { CreateNotificationService } from './create-notification-service';
import { NotificationType } from '../entities/notification';
@Injectable()
export class FinishManutenceService {
  constructor(
    private readonly manutenceRepository: ManutenceRepository,
    private readonly createNotificationService: CreateNotificationService,
  ) {}

  async execute(id: string, status: StatusManutence) {
    const manutence = await this.manutenceRepository.find(id);

    if (!manutence) {
      throw new NotFoundException('Manutenção não encontrada');
    }

    if (manutence.status_manutence === StatusManutence.FINALIZADO) {
      throw new BadRequestException('Manutenção já finalizada');
    }

    manutence.status_manutence = status;

    this.manutenceRepository.update(id, { status_manutence: status });

    // Criar notificação para o cliente
    const statusMessage = status === StatusManutence.FINALIZADO 
      ? 'foi finalizada com sucesso' 
      : status === StatusManutence.CANCELADO 
        ? 'foi cancelada'
        : 'teve seu status atualizado';

    const notificationType = status === StatusManutence.FINALIZADO 
      ? NotificationType.SUCCESS 
      : status === StatusManutence.CANCELADO 
        ? NotificationType.WARNING
        : NotificationType.INFO;

    await this.createNotificationService.execute({
      title: 'Status da Manutenção Atualizado',
      message: `Sua manutenção "${manutence.title}" ${statusMessage}.`,
      type: notificationType,
      userId: manutence.userId,
      manutenceId: id,
    });
  }
}
