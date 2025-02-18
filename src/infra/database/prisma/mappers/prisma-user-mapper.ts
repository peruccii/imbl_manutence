import { User } from 'src/application/entities/user';
import { User as RawUser } from '@prisma/client'
import { Email } from '@application/fieldsValidations/email';
import { Telefone } from '@application/fieldsValidations/telefone';
import { Name } from '@application/fieldsValidations/name';
import { Role } from '@application/enums/role.enum';

export class PrismaUserMapper {
  static toPrisma(user: User) {
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

  static toDomain(rawUser: RawUser) {
    return new User(
      {
        email: new Email(rawUser.email),
        name: new Name(rawUser.name),
        telefone: new Telefone(rawUser.telephone),
        createdAt: rawUser.createdAt,
        typeUser: rawUser.typeUser as Role,
        manutences: rawUser.m
      },
      rawUser.id
    )
  }
}
