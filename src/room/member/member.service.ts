import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { RoomService } from '../room.service';

interface IMember {
  roomId: string;
  userId: string;
}

interface IAdminAndMemberRelation {
  adminId: string;
  memberId: string;
  roomId: string;
}

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMembership(params: IMember) {
    const membership = await this.prismaService.roomMember.findFirst({
      where: {
        roomId: params.roomId,
        userId: params.userId,
        isActivated: true,
      },
    });

    if (!membership) {
      throw new UnauthorizedException();
    }

    return membership;
  }

  async getOwnership(params: IMember) {
    const membership = await this.getMembership(params);

    if (!membership || !membership.isAdmin) {
      throw new UnauthorizedException();
    }

    return membership;
  }

  async join(params: IMember & { isPrivateRoom: boolean }): Promise<void> {
    // check if is already a member
    await this.getMembership(params).catch((error) => {
      if (error instanceof UnauthorizedException) {
        throw new ConflictException();
      }
      throw error;
    });

    await this.prismaService.roomMember.create({
      data: {
        roomId: params.roomId,
        userId: params.userId,
        isAdmin: false,
        // if is public, activate directly
        isActivated: !params.isPrivateRoom,
      },
    });
  }

  // check if the relation is correct
  async getAdminAndMemberMemberships(params: IAdminAndMemberRelation) {
    const adminMembership = await this.getOwnership({
      userId: params.adminId,
      roomId: params.roomId,
    });

    const memberMembership = await this.getMembership({
      userId: params.memberId,
      roomId: params.roomId,
    });

    return { adminMembership, memberMembership };
  }

  async transferOwnership(params: IAdminAndMemberRelation) {
    const { adminMembership, memberMembership } =
      await this.getAdminAndMemberMemberships(params);

    if (!memberMembership.isActivated || !memberMembership.isBanned) {
      throw new Error();
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.roomMember.update({
        where: {
          id: adminMembership.id,
        },
        data: {
          isAdmin: false,
        },
      });

      await tx.roomMember.update({
        where: {
          id: memberMembership.id,
        },
        data: {
          isAdmin: true,
        },
      });
    });
  }

  async getAdminInfo(roomId: string) {
    return await this.prismaService.user.findFirst({
      where: {
        rooms: {
          some: {
            roomId: roomId,
            isAdmin: true,
          },
        },
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async ban(params: IAdminAndMemberRelation) {
    const { memberMembership } = await this.getAdminAndMemberMemberships(
      params,
    );

    if (memberMembership.isBanned === true) {
      throw new ConflictException();
    }

    await this.prismaService.roomMember.update({
      where: {
        id: memberMembership.id,
      },
      data: {
        isBanned: true,
      },
    });
  }

  async validateMembership(params: IAdminAndMemberRelation) {
    const { memberMembership } = await this.getAdminAndMemberMemberships(
      params,
    );

    if (memberMembership.isActivated === true) {
      throw new ConflictException();
    }

    await this.prismaService.roomMember.update({
      where: {
        id: memberMembership.id,
      },
      data: {
        isActivated: true,
      },
    });
  }

  async leave(params: IMember) {
    const membership = await this.getMembership(params);

    if (membership.isAdmin) {
      throw new UnauthorizedException('Assign new admin before leaving');
    }

    await this.prismaService.roomMember.delete({
      where: {
        id: membership.id,
      },
    });
  }
}
