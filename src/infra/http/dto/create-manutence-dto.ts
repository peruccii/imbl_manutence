import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ManutenceCreateDto {
  @IsNotEmpty({ message: 'message is required' })
  @IsString()
  @MinLength(5)
  @MaxLength(455)
  message: string;
  photos: string[];
  video: string;
  @IsNotEmpty({ message: 'userId is required' })
  @IsString()
  userId: string;
}
