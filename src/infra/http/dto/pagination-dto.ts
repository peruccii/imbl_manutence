import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  skip: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number;
}
