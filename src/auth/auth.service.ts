import {
  Dependencies,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/application/repositories/user-repository';
import { AuthResponseDto } from './auth-response.dto';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Dependencies(JwtService)
@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtService = jwtService;
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME')!;
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.findOne(username);
    
    if (!user || !compare(pass, user?.password)) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.name, sub: user.id, role: user.typeUser };
    const accessToken: string = await this.jwtService.signAsync(payload);

    return { access_token: accessToken, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}
