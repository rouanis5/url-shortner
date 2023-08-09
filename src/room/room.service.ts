import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface ICreateRoom {
  userId: string;
  name: string;
  private?: boolean;
}

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRoom(id: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id,
      },
    });

    if (!room) {
      throw new NotFoundException();
    }

    return room;
  }

  async createRoom(params: ICreateRoom) {
    return await this.prismaService.room.create({
      data: {
        name: params.name,
        private: params.private,
        members: {
          create: {
            isAdmin: true,
            isActivated: true,
            userId: params.userId,
          },
        },
      },
    });
  }

  async getSubscribedRooms(userId: string) {
    // also include the not activated and banned rooms
    return await this.prismaService.room.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  // TODO: maybe someday when I'll integrate Redis
  // async inviteToRoom() {}
}
