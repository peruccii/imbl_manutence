import { User } from 'src/application/entities/user';

export class PrismaUserMapper {
  static toPrisma(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      telefone: user.telefone ? user.telefone.value : null,
      password: user.password,
      typeUser: user.typeUser,
      manutence: [],
    };
  }

  static toDomain() {}
}
