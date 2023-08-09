import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface IRoomLink {
  roomId: string;
  linkId: string;
}

@Injectable()
export class LinkService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLinksOfRoom(roomId: string) {
    return await this.prismaService.link.findMany({
      where: {
        roomId,
      },
    });
  }

  async moveToRoom(params: IRoomLink) {
    await this.prismaService.link.update({
      where: {
        id: params.linkId,
      },
      data: {
        roomId: params.roomId,
      },
    });
  }
}
