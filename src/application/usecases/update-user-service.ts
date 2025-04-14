import { UserRepository } from '@application/repositories/user-repository';
import type { UpdateUserDto } from '@infra/http/dto/update-user-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Name } from '@application/fieldsValidations/name';
import { Email } from '@application/fieldsValidations/email';
import { Telefone } from '@application/fieldsValidations/telefone';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, request: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (request.name) {
      user.name = new Name(request.name);
    }
    if (request.email) {
      user.email = new Email(request.email);
    }
    if (request.telephone) {
      user.telephone = new Telefone(request.telephone);
    }

    await this.userRepository.update(user);

    return user;
  }
}
