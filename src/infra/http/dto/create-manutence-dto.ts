import { p } from '@application/interfaces/photos';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ManutenceCreateDto {
  @IsNotEmpty({ message: 'message is required' })
  @IsString()
  @MinLength(50)
  @MaxLength(455)
  message: string;
  photos: p[];
  @IsNotEmpty({ message: 'video is required' })
  video: string;
  @IsNotEmpty({ message: 'userId is required' })
  @IsString()
  userId: string;
}
