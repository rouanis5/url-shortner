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
}
