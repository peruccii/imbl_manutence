import { User } from 'src/application/entities/user';
import { User as RawUser } from '@prisma/client'
import { Email } from '@application/fieldsValidations/email';
import { Telefone } from '@application/fieldsValidations/telefone';
import { Name } from '@application/fieldsValidations/name';
import { Role } from '@application/enums/role.enum';
import { Manutence } from '@application/entities/manutence';

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      telephone: user.telephone ? user.telephone.value : null,
      password: user.password,
      createdAt: user.createdAt,
      typeUser: user.typeUser,
    };
  }

  static toDomain(rawUser: RawUser, manutences: Manutence[]) {
    return new User(
      {
        email: new Email(rawUser.email),
        name: new Name(rawUser.name),
        telephone: rawUser.telephone ? new Telefone(rawUser.telephone) : null,
        createdAt: rawUser.createdAt,
        typeUser: rawUser.typeUser as Role,
        manutences: manutences,
        password: rawUser.password
      },
      rawUser.id
    )
  }
}
