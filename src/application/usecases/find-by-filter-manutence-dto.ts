import { FiltersManutence } from '@application/interfaces/filters-manutence';
import { ManutenceRepository } from '@application/repositories/manutence-repository';
import { ManutenceFiltersDto } from '@infra/http/dto/find-by-filter-manutence-dto';

export class FindManutenceByFilters {
  constructor(private readonly manutenceRepository: ManutenceRepository) {}

  async execute(filters: FiltersManutence) {
    return await this.manutenceRepository.findByFilters(filters);
  }
}
