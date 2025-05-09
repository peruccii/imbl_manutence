import { Injectable } from '@nestjs/common';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { UserRepository } from '@application/repositories/user-repository';
import { UserNotFoundMessage } from '@application/messages/user-not-found';
import { Pagination } from '@application/interfaces/pagination';

@Injectable()
export class FindByIdUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, pagination: Pagination) {
    const user = await this.userRepository.findOne(id, pagination);
    if (!user) {
      throw new NotFoundErrorHandler(UserNotFoundMessage);
    }

    return { user };
  }
}
