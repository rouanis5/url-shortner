import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { IJwtPayload } from 'src/user/types';
import { User } from 'src/user/decorators/user.decorator';
import { RoomResponseDto } from './dto/roomResponse.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { SWAGGER_ENUM } from 'src/common/enums';

@Controller('rooms')
@ApiTags('Rooms')
@UseGuards(AuthGuard)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  @ApiBearerAuth(SWAGGER_ENUM.AUTHORIZATION_HEADER)
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiAcceptedResponse({
    type: RoomResponseDto,
  })
  async createRoom(
    @Body() body: CreateRoomDto,
    @User() user: IJwtPayload,
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.createRoom({
      name: body.name,
      private: body.private,
      userId: user.id,
    });

    return new RoomResponseDto(room);
  }

  @Get()
  @ApiBearerAuth(SWAGGER_ENUM.AUTHORIZATION_HEADER)
  @ApiUnauthorizedResponse()
  @ApiAcceptedResponse({
    type: RoomResponseDto,
    isArray: true,
  })
  async getRooms(@User() user: IJwtPayload): Promise<RoomResponseDto[]> {
    const rooms = await this.roomService.getSubscribedRooms(user.id);
    return rooms.map((room) => new RoomResponseDto(room));
  }
}
