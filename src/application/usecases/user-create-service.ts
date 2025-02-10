import { Injectable } from '@nestjs/common';
import { makeUserFactory } from '../factories/user-factory';
import { CreateUserRequest } from '../interfaces/user-create-request';
import { PrismaUserMapper } from 'src/infra/database/prisma/mappers/prisma-user-mapper';
import { UserRepository } from '../repositories/user-repository';
import { hashPassword } from '../hash/hash_password';
import { UserAlreadyExists } from '../errors/user-already-exists';
import { UserAlreadyExistsMessage } from '../messages/user-already-exsits';

@Injectable()
export class UserCreateService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: CreateUserRequest) {
    const userExists = await this.userRepository.findOne(request.email);

    if (userExists) {
      const err = new UserAlreadyExists(UserAlreadyExistsMessage)
      err.error()
      return
    };  

    const user = makeUserFactory({
      ...request,
      password: await hashPassword(request.password)
    });

    PrismaUserMapper.toPrisma(user);
  }
}
