import { Injectable } from '@nestjs/common';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { BadRequestErrorHandlerFilter } from '@application/utils/pipe-bad-request-error';
import { UserHasManutencesMessage } from '@application/messages/user-has-manutences';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    const userExists = await this.userRepository.findOne(id);

    if (!userExists) {
      const err = new NotFoundErrorHandler(UserNotFoundMessage);
      err.error();
      return;
    }

    if (userExists.manutences.length > 0) {
      throw new BadRequestErrorHandlerFilter(); // custom message
    }

    return this.userRepository.delete(id);
  }
}
