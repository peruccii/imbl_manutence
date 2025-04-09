import { Pagination } from '@application/interfaces/pagination';
import { Manutence } from '../entities/manutence';
import { FiltersManutence } from '@application/interfaces/filters-manutence';
import { StatusManutence } from '@application/enums/StatusManutence';

export interface UpdateManutenceData {
  status_manutence?: StatusManutence;
  adminId?: string;
  chatRoomId?: string;
}

export abstract class ManutenceRepository {
  abstract create(manutence: Manutence): void;
  abstract delete(id: string): void;
  abstract update(id: string, data: UpdateManutenceData): void;
  abstract updateChatRoom(chatRoomId: string, adminId: string): Promise<void>;
  abstract countNewManutences(
    status_manutence: StatusManutence,
  ): Promise<number>;
  abstract findMany(pagination: Pagination): Promise<Manutence[] | []>;
  abstract find(id: string): Promise<Manutence | null>;
  abstract findByFilters(
    filters: FiltersManutence,
    pagination?: Pagination,
  ): Promise<Manutence[] | []>;
  abstract findByAdminId(adminId: string): Promise<Manutence[] | []>;
}
