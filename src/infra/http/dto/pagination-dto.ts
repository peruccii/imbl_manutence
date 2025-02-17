import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  skip: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  limit: number;
}
