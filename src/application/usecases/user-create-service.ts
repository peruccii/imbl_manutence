import { Injectable } from '@nestjs/common';
import { makeUserFactory } from '../factories/user-factory';
import { CreateUserRequest } from '../interfaces/user-create-request';
import { hashPassword } from '../hash/hash_password';
import { UserAlreadyExistsMessage } from '../messages/user-already-exsits';
import { UserRepository } from '@application/repositories/user-repository';
import { UnprocessableEntityErrorHandler } from '@application/errors/already-exists';
import { ValidationError } from '@application/errors/validation-error';

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

    const emailErrors = user.email.validate();
    const passwordErrors = user.password.validate();
    const telephoneErrors = user.telephone.validate();
    const nameErrors =  user.name.validate();

    const allErrors = [
      ...emailErrors, 
      ...passwordErrors, 
      ...telephoneErrors, 
      ...nameErrors
    ];

    if (allErrors.length > 0) throw new ValidationError(allErrors);

    const pass = await hashPassword(request.password);

    return this.userRepository.create(user, pass);
  }
}
