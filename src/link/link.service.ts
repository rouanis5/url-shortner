import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import dayjs from 'dayjs';
import { NotFoundException } from '@nestjs/common';

interface INewLink {
  url: string;
  expiresOn?: Date;
  singleUse?: boolean;
}

@Injectable()
export class LinkService {
  constructor(private prismaService: PrismaService) {}

  async getCount() {
    const count = await this.prismaService.link.count();
    // const timezone = this.config.get('TZ');
    return { count };
  }

  async getById(id: string) {
    const result = await this.prismaService.link.findFirst({
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
      throw new NotFoundException();
    }

    // delete if single urse
    if (result.singleUse === true) {
      this.deleteById(id);
    }

    return result;
  }

  // TODO: add
  async add(body: INewLink) {
    const newLink = await this.prismaService.link.create({
      data: {
        ...body,
      },
    });

    return newLink;
  }

  async deleteById(id: string) {
    return await this.prismaService.link.delete({
      where: {
        id,
      },
    });
  }
}
