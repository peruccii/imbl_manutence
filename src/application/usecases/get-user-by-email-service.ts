import { Injectable } from '@nestjs/common';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { UserRepository } from '@application/repositories/user-repository';
import { UserNotFoundMessage } from '@application/messages/user-not-found';

export interface FindByEmailUserRequest {
  email: string;
}

@Injectable()
export class FindByEmailUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundErrorHandler(UserNotFoundMessage);
    }

    return { user };
  }
}
