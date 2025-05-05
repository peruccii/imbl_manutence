import { CreateReportService } from '@application/usecases/create-report-service';
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { Role } from '@application/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from '@application/guards/role.guards';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';
import { ListAllReportsService } from '@application/usecases/list-all-reports-service';
import { Report } from '@application/entities/report';
import { ReportViewModel } from '../view-models/report-view-model';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportCreateService: CreateReportService,
    private readonly reportListService: ListAllReportsService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createReportDto: CreateReportDto) {
    return this.reportCreateService.execute(createReportDto);
  }

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async listAllReports() {
    const reports = await this.reportListService.execute();

    return reports.map((report: Report) => {
      return ReportViewModel.toGetFormatHttp(report);
    });
  }
}
