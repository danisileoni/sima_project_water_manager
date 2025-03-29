import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { type JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { envs } from 'src/config/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: envs.jwtSecretRefresh,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<{
    id: string;
    name: string;
    surname: string;
    dni: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    role: string[];
    is_active: boolean;
    refreshToken: string;
  }> {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User is BANNED');
    }

    const refreshToken = req?.get('authorization').replace('Bearer', '').trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...user,
      ...payload,
      refreshToken,
    };
  }
}
