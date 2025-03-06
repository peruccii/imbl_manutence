import { Body, Controller, Post } from '@nestjs/common';
import { Role } from 'src/application/enums/role.enum';
import { CreateUserRequest } from 'src/application/interfaces/user-create-request';
import { UserCreateService } from 'src/application/usecases/user-create-service';
import { Roles } from 'src/roles/roles.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly create_user: UserCreateService,
    // private readonly get_user_byemai:
  ) {}

  @Post('create')
  @Roles(Role.ADMIN, Role.USER)
  async createUser(@Body() request: CreateUserRequest) {
    return await this.create_user.execute(request);
  }

  async getUserByEmail() {
    
  }
}
