import { Injectable } from '@nestjs/common';
import { makeManutenceFactory } from '../factories/manutence-factory';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';
import { CreateManutenceRequest } from '../interfaces/manutence-create-request';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';

@Injectable()
export class ManutenceCreateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly manutenceRepository: ManutenceRepository,
  ) {}

  async execute(request_manutence: CreateManutenceRequest) {
    const client = await this.userRepository.findOne(
      request_manutence.client?.id,
    );

    if (!client) {
      const err = new NotFoundErrorHandler(UserNotFoundMessage);
      err.error();
      return;
    }

    const manutence = makeManutenceFactory({
      ...request_manutence,
      client: client,
    });
    return this.manutenceRepository.create(manutence);
  }
}
