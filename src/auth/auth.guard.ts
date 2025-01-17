import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly authIdeaRepo: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization token required');
    }

    // 'Bearer <token>' formatida kelgan tokenni ajratib olish
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const broker = await this.authIdeaRepo.findByTokenIdea(token);

    if (!broker) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
