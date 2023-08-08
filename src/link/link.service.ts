import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import { GoneException, NotFoundException } from '@nestjs/common';

interface INewLink {
  url: string;
  expiresOn?: Date;
  singleUse?: boolean;
}

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getCount() {
    const count = await this.prisma.link.count();
    // const timezone = this.config.get('TZ');
    return { count };
  }

  async getById(id: string) {
    const result = await this.prisma.link.findFirst({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException();
    }

    // delete if expired
    if (result.expiresOn && dayjs().isAfter(result.expiresOn)) {
      this.deleteById(id);
      throw new GoneException();
    }

    // delete if single urse
    if (result.singleUse === true) {
      this.deleteById(id);
    }

    return result;
  }

  // TODO: add
  async add(body: INewLink) {
    const newLink = await this.prisma.link.create({
      data: {
        ...body,
      },
    });

    return newLink;
  }

  async deleteById(id: string) {
    await this.prisma.link.delete({
      where: {
        id,
      },
    });
  }
}
