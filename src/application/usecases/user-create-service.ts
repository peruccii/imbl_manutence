import { Injectable } from '@nestjs/common';
import { makeUserFactory } from '../factories/user-factory';
import { CreateUserRequest } from '../interfaces/user-create-request';
import { hashPassword } from '../hash/hash_password';
import { UserAlreadyExistsMessage } from '../messages/user-already-exsits';
import { UserRepository } from '@application/repositories/user-repository';
import { UnprocessableEntityErrorHandler } from '@application/errors/already-exists';

@Injectable()
export class UserCreateService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: CreateUserRequest) {
    const userExists = await this.userRepository.findByEmail(request.email);
    console.log(request);
    if (userExists) {
      const err = new UnprocessableEntityErrorHandler(UserAlreadyExistsMessage);
      err.error();
      return;
    }

    const user = makeUserFactory(request);

    user.email.validate();
    user.password.validate();
    user.telephone.validate();
    user.name.validate();

    const pass = await hashPassword(request.password);

    return this.userRepository.create(user, pass);
  }
}
