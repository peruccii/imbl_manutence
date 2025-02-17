import { Manutence } from '../entities/manutence';
export interface FiltersManutence {
  status_manutence: string;
}

export abstract class ManutenceRepository {
  abstract create(manutence: Manutence): void;
  abstract delete(id: string): void;
  abstract update(id: string): void;
  abstract findMany(): Promise<Manutence[] | []>;
  abstract find(id: string): Promise<Manutence | null>;
  abstract findByFilters(
    filters: FiltersManutence,
  ): Promise<Manutence[] | null>;
}
