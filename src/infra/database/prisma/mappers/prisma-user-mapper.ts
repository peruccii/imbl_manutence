import { User } from 'src/application/entities/user';
import { User as RawUser } from '@prisma/client';
import { Email } from '@application/fieldsValidations/email';
import { Telefone } from '@application/fieldsValidations/telefone';
import { Name } from '@application/fieldsValidations/name';
import { Role } from '@application/enums/role.enum';
import { Manutence } from '@application/entities/manutence';
import { Password } from '@application/fieldsValidations/password';
import { Cpf } from '@application/fieldsValidations/cpf';

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      telephone: user.telephone.value,
      password: user.password.value,
      cpf: user.cpf.value,
      address: user.address,
      createdAt: user.createdAt,
      typeUser: user.typeUser,
    };
  }

  static toDomain(rawUser: RawUser, manutences: Manutence[]): User {
    return new User(
      {
        cpf: new Cpf(rawUser.cpf),
        email: new Email(rawUser.email),
        name: new Name(rawUser.name),
        address: rawUser.address ?? '',
        telephone: new Telefone(rawUser.telephone),
        createdAt: rawUser.createdAt,
        typeUser: rawUser.typeUser as Role,
        manutences: manutences,
        password: new Password(rawUser.password),
      },
      rawUser.id,
    );
  }
}
