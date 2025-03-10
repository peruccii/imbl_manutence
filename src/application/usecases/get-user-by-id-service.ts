import { Injectable } from '@nestjs/common';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { UserRepository } from '@application/repositories/user-repository';
import { UserNotFoundMessage } from '@application/messages/user-not-found';

@Injectable()
export class FindByIdUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundErrorHandler(UserNotFoundMessage);
    }

    return { user };
  }
}
