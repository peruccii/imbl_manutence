import { User } from "src/application/entities/user";

export class PrismaUserMapper {
    static toPrisma(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            telefone: user.telefone ? user.telefone : null,
            password: user.password,
            manutence: []
        }
    }
}