import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtService } from '@nestjs/jwt';
import { MemberModule } from './member/member.module';
import { MemberService } from './member/member.service';

@Module({
  providers: [RoomService, JwtService, MemberService],
  controllers: [RoomController],
  imports: [MemberModule],
})
export class RoomModule {}
