import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Specialty } from '@application/enums/Specialty';

export class ManutenceCreateDto {
  @IsNotEmpty({ message: 'message is required' })
  @IsString()
  @MinLength(5)
  @MaxLength(455)
  message: string;
  @IsNotEmpty({ message: 'specialties is required' })
  @IsArray()
  specialties: Specialty[];
  photos: {
    fileName: string;
    signedUrl: string;
  }[];
  video: {
    fileName: string;
    signedUrl: string;
  }[];
  @IsNotEmpty({ message: 'userId is required' })
  @IsString()
  userId: string;
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  title: string;
  @IsString()
  address: string;
}
