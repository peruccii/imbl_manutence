import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@application/repositories/user-repository';
import { NotFoundErrorHandler } from '@application/errors/not-found-error.error';
import { UserNotFoundMessage } from '@application/messages/user-not-found';

@Injectable()
export class TransferManutencesToNewAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly manutenceRepository: ManutenceRepository,
  ) {}

  async execute(newAdminId: string, adminId: string) {
    const user = await this.userRepository.findOne(newAdminId);

    if (!user) {
      throw new NotFoundErrorHandler(UserNotFoundMessage);
    }

    const manutences = await this.manutenceRepository.findByAdminId(adminId);

    await this.userRepository.transferManutencesToNewAdmin(
      manutences,
      newAdminId,
      adminId,
    );
  }
}
