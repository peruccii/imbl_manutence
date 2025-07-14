import { Priority } from '@application/enums/Priority';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdatePriorityDto {
  @IsNotEmpty({ message: 'Prioridade é obrigatória' })
  @IsEnum(Priority, { message: 'Prioridade deve ser BAIXA, MEDIA, ALTA ou CRITICA' })
  priority: Priority;
}
