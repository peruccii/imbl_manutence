import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { StatusManutence } from '../enums/StatusManutence';
@Injectable()
export class FinishManutenceService {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

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
  }
}
