import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtService } from '@nestjs/jwt';
import { MemberModule } from './member/member.module';

@Module({
  providers: [RoomService, JwtService],
  controllers: [RoomController],
  imports: [MemberModule],
})
export class RoomModule {}
