import { Pagination } from '@application/interfaces/pagination';
import { UserRepository } from '@application/repositories/user-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(pagination: Pagination) {
    const users = await this.userRepository.findMany(pagination);

    return { users };
  }
}
