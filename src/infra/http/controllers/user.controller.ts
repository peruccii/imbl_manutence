import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/application/enums/role.enum';
import { CreateUserRequest } from 'src/application/interfaces/user-create-request';
import { UserCreateService } from 'src/application/usecases/user-create-service';
import { Roles } from 'src/roles/roles.decorator';
import { FindByEmailUserService } from '@application/usecases/get-user-by-email-service';
import { UserViewModel } from '../view-models/user-view-model';
import { FindByIdUserService } from '@application/usecases/get-user-by-id-service';
import { PaginationDto } from '../dto/pagination-dto';
import { User } from '@application/entities/user';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetAllUsersService } from '@application/usecases/find-all-users-service';
import { RolesGuard } from '@application/guards/role.guards';

@Controller('user')
export class UserController {
  constructor(
    private readonly create_user: UserCreateService,
    private readonly get_user_byemail: FindByEmailUserService,
    private readonly get_user_byid: FindByIdUserService,
    private readonly get_all_users: GetAllUsersService,
  ) {}

  @Post('create')
  async createUser(@Body() request: CreateUserRequest) {
    return await this.create_user.execute(request);
  }

  @Get('get/email/:email')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUserByEmail(@Param('email') email: string) {
    const { user } = await this.get_user_byemail.execute(email);

    return UserViewModel.toGetFormatHttp(user);
  }

  @Get('get/id/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getUserById(@Param('id') id: string) {
    const { user } = await this.get_user_byid.execute(id);

    return UserViewModel.toGetFormatHttp(user);
  }

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers(@Query() pagination: PaginationDto) {
    const { users } = await this.get_all_users.execute(pagination);

    return users.map((user: User) => {
      return UserViewModel.toGetFormatHttp(user);
    });
  }
}
