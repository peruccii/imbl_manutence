import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service';
import type { RefreshTokenDto } from '../dto/refresh-token-dto';
import type { ForgotPasswordDto } from '../dto/forgot-password-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('refresh-token')
  @UsePipes(new ValidationPipe({ transform: true }))
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.authService.forgotPasswordUser(forgotPassword);
  }
}
