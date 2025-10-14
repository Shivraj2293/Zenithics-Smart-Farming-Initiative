import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    // --- THIS IS THE FIX ---
    // 1. Get the secret from the ConfigService first.
    const secret = configService.get<string>('JWT_SECRET');

    // 2. If the secret is missing, throw an error to prevent the app from starting insecurely.
    if (!secret) {
      throw new Error('JWT_SECRET environment variable not set!');
    }

    // 3. Pass the now-guaranteed secret to the super() constructor.
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

