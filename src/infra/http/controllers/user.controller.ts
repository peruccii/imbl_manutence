import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
import { DeleteUserService } from '@application/usecases/delete-user-service';
import { TransferManutencesToNewAdminService } from '@application/usecases/transfer-manutences-to-new-admin-service';
import { UserId } from '@application/utils/extract-user-id';
import { GetAllAdminsService } from '@application/usecases/get-all-admins-service';
import { UpdateUserDto } from '../dto/update-user-dto';
import { UpdateUserService } from '@application/usecases/update-user-service';
@Controller('user')
export class UserController {
  constructor(
    private readonly create_user: UserCreateService,
    private readonly get_user_byemail: FindByEmailUserService,
    private readonly get_user_byid: FindByIdUserService,
    private readonly get_all_users: GetAllUsersService,
    private readonly delete_user: DeleteUserService,
    private readonly transfer_manutences_to_new_admin: TransferManutencesToNewAdminService,
    private readonly get_all_admins: GetAllAdminsService,
    private readonly update_user: UpdateUserService,
  ) {}

  @Post('create')
  async createUser(@Body() request: CreateUserRequest) {
    return await this.create_user.execute(request);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(@Param('id') id: string, @Body() request: UpdateUserDto) {
    return await this.update_user.execute(id, request);
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

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteUser(@Param('id') id: string) {
    return await this.delete_user.execute(id);
  }

  @Post('manutences/transfer/to/:newAdminId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async transferManutencesToNewAdmin(
    @Param('newAdminId') newAdminId: string,
    @UserId() adminId: string,
  ) {
    return await this.transfer_manutences_to_new_admin.execute(
      newAdminId,
      adminId,
    );
  }

  @Get('all/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllAdmins(@Query() pagination: PaginationDto) {
    const { admins } = await this.get_all_admins.execute(pagination);

    return admins.map((admin: User) => {
      return UserViewModel.toGetFormatHttp(admin);
    });
  }
}
