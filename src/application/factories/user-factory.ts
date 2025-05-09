import { Password } from '@application/fieldsValidations/password';
import { User } from '../entities/user';
import { Email } from '../fieldsValidations/email';
import { Name } from '../fieldsValidations/name';
import { Telefone } from '../fieldsValidations/telefone';
import { CreateUserRequest } from '../interfaces/user-create-request';
import { Cpf } from '@application/fieldsValidations/cpf';

type Override = CreateUserRequest;

export function makeUserFactory(override: Override) {
  return new User({
    name: new Name(override.name),
    email: new Email(override.email),
    telephone: new Telefone(override.telephone),
    cpf: new Cpf(override.cpf),
    address: override.address,
    typeUser: override.typeUser,
    password: new Password(override.password),
    manutences: [],
  });
}
