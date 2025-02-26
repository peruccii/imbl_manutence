import { Injectable } from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { ManutenceNotFoundMessage } from '../messages/manutence-not-found';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';

@Injectable()
export class DeleteManutenceService {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(id: string) {
    const manutenceExists = await this.manutenceRepository.find(id);

    if (!manutenceExists) {
      const err = new NotFoundErrorHandler(ManutenceNotFoundMessage);
      err.error();
      return;
    }

    return this.manutenceRepository.delete(id);
  }
}
