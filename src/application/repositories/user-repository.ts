import { Pagination } from '@application/interfaces/pagination';
import { User } from '../entities/user';
import type { Manutence } from '@application/entities/manutence';
import type { Role } from '@application/enums/role.enum';

export abstract class UserRepository {
  abstract create(user: User, pass: string): Promise<void>;
  abstract delete(id: string): Promise<void>;

  abstract findOne(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findMany(pagination: Pagination): Promise<User[] | []>;
  abstract transferManutencesToNewAdmin(
    manutences: Manutence[],
    newAdminId: string,
    adminId: string,
  ): Promise<void>;
  abstract findByRole(role: Role, pagination: Pagination): Promise<User[] | []>;
}
