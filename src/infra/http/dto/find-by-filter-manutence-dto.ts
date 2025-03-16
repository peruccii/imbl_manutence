import { StatusManutence } from '@application/enums/StatusManutence';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class ManutenceFiltersDto {
  @IsOptional()
  @Type(() => String) 
  @IsEnum(StatusManutence, {
    each: true,
    message:
      'status_manutence deve ser ANDAMENTO, NOVO, FINALIZADO ou CANCELADO',
  })
  status_manutence?: StatusManutence[];
}
