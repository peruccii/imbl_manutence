import { Role } from "@application/enums/role.enum";

export class AuthResponseDto {
  userId: string;
  typeUser: Role
  access_token: string;
  refresh_token: string
  expiresIn: number;
}
