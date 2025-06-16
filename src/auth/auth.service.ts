import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { type CreateUserDto } from 'src/users/dto/create-user.dto';
import { type LoginUserDto } from '../auth/dto/login-user.dto';
import { type UpdateUserDto } from 'src/users/dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { type Response } from 'express';
import { type JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { type LoginDashboardDto } from './dto/login-dashboard.dto';
import { type SendForgotPasswordDto } from './dto/send-forgot-password.dto';
import { MailsService } from 'src/mails/mails.service';
import { type ForgotPasswordDto } from './dto/forgot-password.dto';

const options = {
  timeCost: 2,
  memoryCost: 65536,
  parallelism: 2,
  hashLength: 40,
  type: argon2.argon2id,
  version: 0x13,
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailsService,
    readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto, res: Response): Promise<void> {
    const { password, confirmPassword, ...userData } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords are not the same');
    }

    const user = this.usersRepository.create({
      ...userData,
      password: await argon2.hash(createUserDto.password, options),
    });

    await this.usersRepository.save(user).catch((error) => {
      if (error.detail.includes('email') || error.detail.includes('username')) {
        const detailsError = error.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        throw new BadRequestException(
          `The ${detailsError[1]} '${detailsError[2]}' already exists`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException('check logs server');
    });
    delete user.password;

    const tokens = await this.jwtSing(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    res.cookie('token', tokens.accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    res.cookie('rs-token', tokens.refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    res.status(200).send({ user });
  }

  async login(loginUserDto: LoginUserDto, res: Response): Promise<void> {
    const { password, dni } = loginUserDto;

    const user = await this.usersRepository.findOne({
      where: { dni },
      select: { dni: true, password: true, id: true },
    });

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    delete user.password;
    delete user.role;

    const tokens = await this.jwtSing(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    res.cookie('token', tokens.accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    res.cookie('rs-token', tokens.refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    res.status(200).send({ user });
  }

  async loginDashboard(
    loginDashboardDto: LoginDashboardDto,
    res: Response,
  ): Promise<void> {
    const { password, email } = loginDashboardDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user.role.includes('admin')) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    delete user.password;
    delete user.role;

    const tokens = await this.jwtSing(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    res.cookie('token', tokens.accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    res.cookie('rs-token', tokens.refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
    });
    res.status(200).send({ user });
  }

  async sendForgotPassword(
    forgotPasswordDto: SendForgotPasswordDto,
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException(
        `User not found with email: ${forgotPasswordDto.email}`,
      );
    }
    try {
      const token = await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: 60 * 8,
        },
      );

      await this.mailService.sendForgotPassword({
        mailUser: user.email,
        name: user.name,
        token,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async forgotPassword(
    token: string,
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{
    message: string;
  }> {
    await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      })
      .catch(() => {
        throw new BadRequestException('Token invalid');
      });

    if (forgotPasswordDto.password !== forgotPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords are not the same');
    }

    const payload = this.jwtService.decode(token);

    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
      select: { password: true, id: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    try {
      const hashPassword = await argon2.hash(
        forgotPasswordDto.password,
        options,
      );

      await this.usersRepository.update(user.id, { password: hashPassword });

      return {
        message: 'ok',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: { password: true },
    });

    if (updateUserDto.currentPassword) {
      if (
        !user ||
        !(await argon2.verify(user.password, updateUserDto.currentPassword))
      ) {
        throw new BadRequestException('Current password is incorrect');
      }
    }

    if (updateUserDto.password) {
      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new BadRequestException('Passwords are not the same');
      }
      updateUserDto.password = await argon2.hash(
        updateUserDto.password,
        options,
      );
    }

    const userUpdate = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!userUpdate) {
      throw new NotFoundException(`Not found user with id ${id}`);
    }

    try {
      await this.usersRepository.save(userUpdate);
      delete userUpdate.password;
      delete userUpdate.role;
      delete userUpdate.hash_refresh_token;
      delete userUpdate.is_active;

      return userUpdate;
    } catch (error) {
      const detailsError = error.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
      throw new BadRequestException(
        `The ${detailsError[1]} '${detailsError[2]}' already exists`,
      );
    }
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    res: Response,
  ): Promise<Response<User>> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user || !user.hash_refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await argon2.verify(
      user.hash_refresh_token,
      refreshToken,
    );
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.jwtSing(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    res
      .cookie('token', tokens.accessToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
      })
      .cookie('rs-token', tokens.refreshToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
      });

    console.log('holi');
    return res.status(200).send({ user });
  }

  async refreshTokensDashboard(
    userId: string,
    refreshToken: string,
    res: Response,
  ): Promise<Response<User>> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user || !user.hash_refresh_token) {
      throw new ForbiddenException('Access Denied');
    }
    if (!user.role.includes('admin')) {
      throw new UnauthorizedException('Access Denied');
    }

    const rtMatches = await argon2.verify(
      user.hash_refresh_token,
      refreshToken,
    );
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.jwtSing(user);
    await this.updateRtHash(user.id, tokens.refreshToken);
    res
      .cookie('token', tokens.accessToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
      })
      .cookie('rs-token', tokens.refreshToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: true,
      });
    return res.status(200).send({ user });
  }

  async verifyAccessToken(accessToken: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('This token is not valid');
    }
  }

  async verifyAccessTokenDashboard(accessToken: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.usersRepository.findOneBy({ id: decoded.id });

      if (!user.role.includes('admin')) {
        throw new UnauthorizedException('Access denied');
      }

      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('This token is not valid');
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await this.usersRepository
        .createQueryBuilder()
        .update()
        .set({ hash_refresh_token: null })
        .where('id = :id', { id: userId })
        .execute();

      return true;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Check log server');
    }
  }

  async updateRtHash(userId: string, refreshToken: string): Promise<void> {
    const hash = await argon2.hash(refreshToken);
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ hash_refresh_token: hash })
      .where('id = :id', { id: userId })
      .execute();
  }

  async jwtSing(
    payload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: payload.id },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        { id: payload.id },
        {
          secret: this.configService.get('JWT_SECRET_REFRESH'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
