import { User } from '../entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findOne(id: string): Promise<User | null>;
}
