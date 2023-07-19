import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getCount() {
    const count = await this.prisma.link.count();
    const timezone = this.config.get('TZ');
    return { count, timezone };
  }

  async getById(id: string) {
    const result = await this.prisma.link.findFirst({
      where: {
        id,
      },
    });

    if (!result) {
      throw new Error('link not found');
    }

    return result;
  }

  async add(url: string) {
    const newLink = await this.prisma.link.create({
      data: {
        url: url,
      },
    });

    return newLink;
  }
}
