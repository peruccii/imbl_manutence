import { Password } from '@application/fieldsValidations/password';
import { User } from '../entities/user';
import { Email } from '../fieldsValidations/email';
import { Name } from '../fieldsValidations/name';
import { Telefone } from '../fieldsValidations/telefone';
import { CreateUserRequest } from '../interfaces/user-create-request';

type Override = CreateUserRequest;

export function makeUserFactory(override: Override) {
  return new User({
    name: new Name(override.name),
    email: new Email(override.email),
    telephone: override.telephone ? new Telefone(override.telephone) : null,
    typeUser: override.typeUser,
    password: new Password(override.password),
    manutences: [],
  });
}
