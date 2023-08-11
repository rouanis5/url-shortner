import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { IJwtPayload } from 'src/user/types';
import { User } from 'src/user/decorators/user.decorator';
import { RoomResponseDto } from './dto/roomResponse.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { SWAGGER_ENUM } from 'src/common/enums';
import { IdDTO } from 'src/common/dto/id.dto';
import { MemberService } from './member/member.service';
import { MemberResponseDto } from './dto/memberResponse.dto';

@Controller('rooms')
@ApiTags('Rooms')
@UseGuards(AuthGuard)
export class RoomController {
  constructor(
    private roomService: RoomService,
    private memberService: MemberService,
  ) {}

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

  @Get('/:id')
  @ApiBearerAuth(SWAGGER_ENUM.AUTHORIZATION_HEADER)
  @ApiAcceptedResponse({
    type: RoomResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse({
    description: 'wrong id, id of type nanoid(15)',
  })
  @ApiUnauthorizedResponse()
  async getRoomById(
    @Param() params: IdDTO,
    @User() user: IJwtPayload,
  ): Promise<RoomResponseDto> {
    // get the room
    const room = await this.roomService.getRoom(params.id);

    // check membership
    await this.memberService.getMembership({
      roomId: params.id,
      userId: user.id,
    });

    return new RoomResponseDto(room);
  }

  @Get('/:id/join')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth(SWAGGER_ENUM.AUTHORIZATION_HEADER)
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'already a member' })
  @ApiBadRequestResponse({
    description: 'wrong id, id of type nanoid(15)',
  })
  @ApiUnauthorizedResponse()
  async joinRoom(
    @Param() params: IdDTO,
    @User() user: IJwtPayload,
  ): Promise<void> {
    const room = await this.roomService.getRoom(params.id);

    await this.memberService.join({
      isPrivateRoom: room.private,
      roomId: params.id,
      userId: user.id,
    });
  }

  @Get('/:id/members')
  @ApiBearerAuth(SWAGGER_ENUM.AUTHORIZATION_HEADER)
  @ApiAcceptedResponse({
    type: MemberResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse({
    description: 'wrong id, id of type nanoid(15)',
  })
  @ApiUnauthorizedResponse()
  async getRoomMembers(
    @Param() params: IdDTO,
    @User() user: IJwtPayload,
  ): Promise<MemberResponseDto[]> {
    await this.roomService.getRoom(params.id);

    // check membership
    await this.memberService.getMembership({
      roomId: params.id,
      userId: user.id,
    });

    // return members list
    const members = await this.memberService.getMembers(params.id);
    return members.map((member) => new MemberResponseDto(member));
  }
}
