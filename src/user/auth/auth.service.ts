import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

interface IJwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return {
      token: await this.generateAccessToken({
        id: user.id,
        email: user.email,
      }),
    };
  }

  async generateAccessToken(payload: IJwtPayload) {
    return await this.jwtService.signAsync(payload);
  }
}
