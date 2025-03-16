import { IsString } from "class-validator";

export class ForgotPasswordDto {
  @IsString()
  userId: string

  @IsString()
  newPassword: string
}