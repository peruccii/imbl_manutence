import { Dependencies, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/application/repositories/user-repository';

@Dependencies(JwtService)
@Injectable()
export class AuthService {
    constructor(private usersService: UserRepository, private jwtService) {
      this.jwtService = jwtService;
    }

    async signIn(username: string, pass: string): Promise<any> {
      const user = await this.usersService.findOne(username);
      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }
      const payload = { username: user.name, sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
}
