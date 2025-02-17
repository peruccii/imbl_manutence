import { Pagination } from '@application/interfaces/pagination';
import { Manutence } from '../entities/manutence';
import { FiltersManutence } from '@application/interfaces/filters-manutence';

export abstract class ManutenceRepository {
  abstract create(manutence: Manutence): void;
  abstract delete(id: string): void;
  abstract update(id: string): void;
  abstract findMany(pagination: Pagination): Promise<Manutence[] | []>;
  abstract find(id: string): Promise<Manutence | null>;
  abstract findByFilters(
    filters: FiltersManutence,
    pagination: Pagination
  ): Promise<Manutence[] | null>;
}
