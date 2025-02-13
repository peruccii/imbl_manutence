import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/application/enums/role.enum';

export const ROLES_KEY = 'typeUser';
export const Roles = (...typeUser: Role[]) => SetMetadata(ROLES_KEY, typeUser);
