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
import type {
  FindByEmailParams,
  FindOneParams,
} from '../dto/find-one-manutence-dto';
import  { FindByEmailUserService } from '@application/usecases/get-user-by-email-service';
import { UserViewModel } from '../view-models/user-view-model';
import  { FindByIdUserService } from '@application/usecases/get-user-by-id-service';
import  { PaginationDto } from '../dto/pagination-dto';
import  { User } from '@application/entities/user';
import { AuthGuard } from 'src/auth/auth.guard';
import  { GetAllUsersService } from '@application/usecases/find-all-users-service';

@Controller('user')
export class UserController {
  constructor(
    private readonly create_user: UserCreateService,
    private readonly get_user_byemail: FindByEmailUserService,
    private readonly get_user_byid: FindByIdUserService,
    private readonly get_all_users: GetAllUsersService,
  ) {}

  @Post('create')
  @Roles(Role.ADMIN)
  async createUser(@Body() request: CreateUserRequest) {
    return await this.create_user.execute(request);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('get/email/:email')
  async getUserByEmail(@Param('email') param: FindByEmailParams) {
    const { user } = await this.get_user_byemail.execute(param);

    return UserViewModel.toGetFormatHttp(user);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('get/id/:id')
  async getUserById(@Param('id') param: FindOneParams) {
    const { user } = await this.get_user_byid.execute(param);

    return UserViewModel.toGetFormatHttp(user);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  async getAllUsers(@Query() pagination: PaginationDto) {
    const { users } = await this.get_all_users.execute(pagination);

    return users.map((user: User) => {
      return UserViewModel.toGetFormatHttp(user);
    });
  }
}
