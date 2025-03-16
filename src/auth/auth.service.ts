import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/application/repositories/user-repository';
import { AuthResponseDto } from './auth-response.dto';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import type { ForgotPassword } from '@application/interfaces/forgot-password-interface';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtService = jwtService;
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    )!;
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne(payload.userId);
      return user;
    } catch (err) {
      return null;
    }
  }

  async signIn(email: string, pass: string): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user || !(await compare(pass, user?.password.value))) {
      throw new UnauthorizedException();
    }
    const refreshToken = await this.generateRefreshToken(user.id);

    const payload = {
      username: user.name,
      sub: user.id,
      typeUser: user.typeUser,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);

    return {
      userId: payload.sub,
      typeUser: payload.typeUser,
      access_token: accessToken,
      refresh_token: refreshToken,
      expiresIn: this.jwtExpirationTimeInSeconds,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersRepository.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { username: user.name, sub: user.id, typeUser: user.typeUser };
      const newAccessToken = await this.jwtService.signAsync(newPayload);

      const newRefreshToken = await this.generateRefreshToken(user.id);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expiresIn: this.jwtExpirationTimeInSeconds,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateRefreshToken(userId: string) {
    const token = this.jwtService.sign({ sub: userId }, { expiresIn: '30d' });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
   
    return token
    }

    async forgotPasswordUser(payload: ForgotPassword) {
      
    }
}
