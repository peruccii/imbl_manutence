import { Injectable } from '@nestjs/common';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { ManutenceNotFoundError } from '../errors/manutence-not-found.error';
import { ManutenceNotFoundMessage } from '../messages/manutence-not-found';

@Injectable()
export class DeleteManutenceService {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(id: string) {
    const manutenceExists = await this.manutenceRepository.find(id);

    if (!manutenceExists) {
      const err = new ManutenceNotFoundError(ManutenceNotFoundMessage);
      err.error();
      return;
    }

    return this.manutenceRepository.delete(id);
  }
}
