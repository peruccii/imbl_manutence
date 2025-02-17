import { StatusManutence } from '@application/enums/StatusManutence';
import { IsEnum, IsOptional } from 'class-validator';

export class ManutenceFiltersDto {
  @IsOptional()
  @IsEnum(StatusManutence, {
    message:
      'status_manutence deve ser PENDING, IN_PROGRESS, COMPLETED ou CANCELED',
  })
  status_manutence?: StatusManutence;
}
