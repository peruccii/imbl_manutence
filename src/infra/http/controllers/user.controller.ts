import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequest } from 'src/application/interfaces/user-create-request';
import { UserCreateService } from 'src/application/usecases/user-create-service';

@Controller('user')
export class UserController {
  constructor(private readonly create_user: UserCreateService) {}

  @Post('create')
  async createUser(@Body() request: CreateUserRequest) {
    return await this.create_user.execute(request);
  }
}
