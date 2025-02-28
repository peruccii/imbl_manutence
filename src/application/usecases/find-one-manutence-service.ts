import { Injectable } from '@nestjs/common';
import { ManutenceNotFoundMessage } from '../messages/manutence-not-found';
import { ManutenceRepository } from '../repositories/manutence-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';

export interface FindOneManutenceRequest {
  id: string;
}

@Injectable()
export class FindOneManutenceService {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(request: FindOneManutenceRequest) {
    const { id } = request;
    const manutence = await this.manutenceRepository.find(id);

    if (!manutence) {
      throw new NotFoundErrorHandler(ManutenceNotFoundMessage);
    }

    return { manutence };
  }
}
