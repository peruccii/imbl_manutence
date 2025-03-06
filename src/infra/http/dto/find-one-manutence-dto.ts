import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FindOneParams {
  @IsString({ message: 'the id must be a string' })
  @IsNotEmpty({ message: 'the id must be not empty' })
  id: string;
}

export class FindByEmailParams {
  @IsString({ message: 'the email must be a string' })
  @IsNotEmpty({ message: 'the email must be not empty' })
  @IsEmail()
  email: string;
}
