import { Injectable } from '@nestjs/common';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';

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

    return this.userRepository.delete(id);
  }
}
