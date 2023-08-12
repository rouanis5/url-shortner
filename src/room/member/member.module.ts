import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { RoomService } from '../room.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [MemberService, RoomService],
  controllers: [MemberController],
  imports: [JwtModule],
})
export class MemberModule {}
