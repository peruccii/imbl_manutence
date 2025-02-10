import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/application/enums/role.enum';
import { CreateManutenceRequest, ManutenceCreateService } from 'src/application/usecases/manutence-create-service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller()
export class ManutenceController {
  constructor(private readonly manutence_service: ManutenceCreateService) {}

  @UseGuards(AuthGuard)
  @Post()
  @Roles(Role.DEFAULT)
  async createManutence(@Body() request: CreateManutenceRequest) {
    return await this.manutence_service.execute(request)
  }
}
