import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/application/repositories/user-repository';

@Injectable()
export class AuthService {
    constructor(private usersService: UserRepository) {}

    async signIn(username: string, pass: string): Promise<any> {
      const user = await this.usersService.findOne(username);
      if (user?.password !== pass) {
        throw new UnauthorizedException();
      }
      const { password, ...result } = user;
      return result;
    }
}
