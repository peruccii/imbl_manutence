import { UserNotFoundError } from '../errors/user-not-found.errors';
import { UserNotFoundMessage } from '../messages/user-not-found';
import { UserRepository } from '../repositories/user-repository';

export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    const userExists = await this.userRepository.findOne(id);

    if (!userExists) {
      const err = new UserNotFoundError(UserNotFoundMessage);
      err.error();
      return;
    }

    return this.userRepository.delete(id);
  }
}
