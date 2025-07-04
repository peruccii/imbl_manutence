import { Injectable } from '@nestjs/common';
import { makeManutenceFactory } from '../factories/manutence-factory';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';
import { CreateManutenceRequest } from '../interfaces/manutence-create-request';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { ValidationError } from '@application/errors/validation-error';
import { CreateNotificationService } from './create-notification-service';
import { NotificationType } from '../entities/notification';

@Injectable()
export class ManutenceCreateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly manutenceRepository: ManutenceRepository,
    private readonly createNotificationService: CreateNotificationService,
  ) {}

  async execute(request_manutence: CreateManutenceRequest) {
    const client = await this.userRepository.findOne(request_manutence.userId);

    if (!client) {
      const err = new NotFoundErrorHandler(UserNotFoundMessage);
      err.error();
      return;
    }

    const manutence = makeManutenceFactory(request_manutence);

    const messageError = manutence.message.validate();

    if (messageError.length > 0) throw new ValidationError(messageError);

    await this.manutenceRepository.create(manutence);

    // Criar notificação para o usuário
    await this.createNotificationService.execute({
      title: 'Nova Manutenção Criada',
      message: `Sua solicitação de manutenção "${manutence.title}" foi criada com sucesso.`,
      type: NotificationType.SUCCESS,
      userId: request_manutence.userId,
      manutenceId: manutence.id,
    });
  }
}
