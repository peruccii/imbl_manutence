import { RequestContext } from '@application/utils/request-context';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  
  private jwtSecret: string
  constructor
  (
    private readonly requestContext: RequestContext,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET')!
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      console.log('=== AUTH GUARD DEBUG ===');
      console.log('Token:', token?.substring(0, 20) + '...');
      console.log('Payload:', payload);
      console.log('User ID (sub):', payload.sub);

      // this.requestContext.set('userId', payload.sub);

      request['user'] = payload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
