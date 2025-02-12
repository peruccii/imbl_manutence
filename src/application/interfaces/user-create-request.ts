import { Role } from '../enums/role.enum';

export interface CreateUserRequest {
  name: string;
  telefone: string | null;
  password: string;
  email: string;
  typeUser: Role.USER;
}
