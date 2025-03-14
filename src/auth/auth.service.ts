import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/application/repositories/user-repository';
import { AuthResponseDto } from './auth-response.dto';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

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

    const payload = {
      username: user.name,
      sub: user.id,
      typeUser: user.typeUser,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);

    return {
      userId: payload.sub,
      access_token: accessToken,
      expiresIn: this.jwtExpirationTimeInSeconds,
    };
  }
}
