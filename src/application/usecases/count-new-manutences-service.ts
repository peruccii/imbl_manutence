import { StatusManutence } from '@application/enums/StatusManutence';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCountNewManutences {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(status_manutence: StatusManutence) {
    return await this.manutenceRepository.countNewManutences(status_manutence);
  }
}
