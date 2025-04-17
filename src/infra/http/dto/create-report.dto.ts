import { IsString } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

import { IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  manutenceId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsString()
  description: string;

  @IsString()
  title: string;
}
