import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneParams {
  @IsString({ message: 'the id must be a string' })
  @IsNotEmpty({ message: 'the id must be not empty' })
  id: string;
}
