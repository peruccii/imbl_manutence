import { CreateReportService } from '@application/usecases/create-report-service';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Role } from '@application/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from '@application/guards/role.guards';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateReportDto } from '../dto/create-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportCreateService: CreateReportService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createReportDto: CreateReportDto) {
    return this.reportCreateService.execute(createReportDto);
  }
}
