import { CreateReportService } from '@application/usecases/create-report-service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ValidationPipe,
  Put,
  UsePipes,
  Param,
} from '@nestjs/common';
import { Role } from '@application/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from '@application/guards/role.guards';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';
import { ListAllReportsService } from '@application/usecases/list-all-reports-service';
import { Report } from '@application/entities/report';
import { ReportViewModel } from '../view-models/report-view-model';
import { UpdateReportService } from '@application/usecases/update-report-service';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportCreateService: CreateReportService,
    private readonly reportListService: ListAllReportsService,
    private readonly reportUpdateContent: UpdateReportService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createReportDto: CreateReportDto) {
    return this.reportCreateService.execute(createReportDto);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateReport(@Param('id') id: string, @Body() request: {}) {
    return await this.reportUpdateContent.execute(id, request);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async listAllReports(
    @Query(new ValidationPipe({ transform: true }))
    manutenceId: {
      manutenceId: string;
    },
  ) {
    const reports = await this.reportListService.execute(
      manutenceId.manutenceId,
    );

    return reports.map((report: Report) => {
      return ReportViewModel.toGetFormatHttp(report);
    });
  }
}
