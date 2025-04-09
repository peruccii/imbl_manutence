import { Pagination } from '@application/interfaces/pagination';
import { UserRepository } from '@application/repositories/user-repository';
import { Role } from '@application/enums/role.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllAdminsService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(pagination: Pagination) {
    const admins = await this.userRepository.findByRole(Role.ADMIN, pagination);

    return { admins };
  }
}
