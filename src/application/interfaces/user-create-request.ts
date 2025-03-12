import { Role } from '../enums/role.enum';

export interface CreateUserRequest {
  name: string;
  telephone: string;
  password: string;
  email: string;
  typeUser: Role.USER;
}
