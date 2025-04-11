import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from '@application/guards/role.guards';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/application/enums/role.enum';
import { PaginationDto } from '../dto/pagination-dto';
import { HistoryManutenceRepository } from '@application/repositories/history-manutence-repository';
import { HistoryManutence } from '@application/entities/history_manutence';
import { HistoryManutenceViewModel } from '../view-models/history-manutence-view-model';

@Controller('history')
export class HistoryController {
  constructor(
    private readonly historyManutenceRepository: HistoryManutenceRepository,
  ) {}

  @Get('manutence')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getManutenceHistory(@Query() pagination: PaginationDto) {
    const histories =
      await this.historyManutenceRepository.findMany(pagination);

    return histories.map((history: HistoryManutence) => {
      return HistoryManutenceViewModel.toGetFormatHttp(history);
    });
  }

  @Get('manutence/:manutenceId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getManutenceHistoryById(
    @Query() pagination: PaginationDto,
    @Param('manutenceId') manutenceId: string,
  ) {
    const histories = await this.historyManutenceRepository.findByManutenceId(
      manutenceId,
      pagination,
    );

    return histories.map((history: HistoryManutence) => {
      return HistoryManutenceViewModel.toGetFormatHttp(history);
    });
  }
}
