import { Controller, Post } from '@nestjs/common';
import { Role } from 'src/application/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller()
export class ManutenceController {
  constructor() {}

  @Post()
  @Roles(Role.ADMIN)
  async createManutence() {}
}
