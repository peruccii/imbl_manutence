import { FiltersManutence } from '@application/interfaces/filters-manutence';
import { Pagination } from '@application/interfaces/pagination';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindManutenceByFilters {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(filters: FiltersManutence, pagination: Pagination) {
    const manutences = await this.manutenceRepository.findByFilters(filters, pagination);
    return { manutences }
  }
}
