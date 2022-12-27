import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async singup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      // save the new user into DB

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      console.log(user);

      // return the saved user
      return { message: 'Signup Successfull' };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials Incorrect');

    // if user does not throw exception

    // compare password

    const pwMatches = await argon.verify(user.hash, dto.password);
    console.log(pwMatches);

    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect');

    // if password incorrect throw exception

    // send back user
    return this.signToken(user.id, user.email);
  }

  // test

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
