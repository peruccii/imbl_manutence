import { Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../errors/user-not-found.errors';
import { makeManutenceFactory } from '../factories/manutence-factory';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';
import { CreateManutenceRequest } from '../interfaces/manutence-create-request';

@Injectable()
export class ManutenceCreateService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request_manutence: CreateManutenceRequest) {
    const client = await this.userRepository.findOne(
      request_manutence.client?.id,
    );
    // TODO: Move this logic below to display this message on prisma find one logic
    if (!client) {
      const err = new UserNotFoundError(UserNotFoundMessage);
      err.error();
      return;
    }

    makeManutenceFactory({ ...request_manutence, client: client });
  }
}
