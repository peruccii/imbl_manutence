import { User } from '../entities/user';

export abstract class UserRepository {
  abstract create(user: User, pass: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findOne(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
