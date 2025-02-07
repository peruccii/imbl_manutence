import { User } from "../entities/user";

export abstract class UserRepository {
    abstract create(user: User): void
    abstract delete(id: string): void
    abstract findOne(id: string): Promise<User | null>
}