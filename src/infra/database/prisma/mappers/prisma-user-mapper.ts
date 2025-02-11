import { User } from "src/application/entities/user";
import { Role } from "src/application/enums/role.enum";

export class PrismaUserMapper {
    static toPrisma(user: User) {
        return {
            id: user.id,
            name: user.name.value,
            email: user.email.value,
            telefone: user.telefone ? user.telefone.value : null,
            password: user.password,
            typeUser: user.typeUser,
            manutence: []
        }
    }

    static toDomain() {

    }
}