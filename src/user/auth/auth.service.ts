import {
  UnauthorizedException,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { SignInDto, SignUpDto } from '../dtos';
import { IJwtPayload } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(params: SignUpDto) {
    const isEmailExisted = await this.prismaService.user.findFirst({
      where: {
        email: params.email,
      },
    });

    if (isEmailExisted) {
      throw new HttpException('Email is already in use!', 400);
    }

    const hashedPassword = await bcrypt.hashSync(params.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: params.email,
        password: hashedPassword,
      },
    });

    return {
      token: await this.generateAccessToken({
        id: user.id,
        email: user.email,
      }),
    };
  }

  async signIn({ email, password }: SignInDto) {
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
