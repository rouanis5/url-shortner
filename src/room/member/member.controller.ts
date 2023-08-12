import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/user/auth/auth.guard';
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
import { SWAGGER_ENUM } from 'src/common/enums';
import { MemberResponseDto } from '../dto/memberResponse.dto';
import { IdDTO } from 'src/common/dto/id.dto';
import { IJwtPayload } from 'src/user/types';
import { roomMemberParamsDto } from '../dto/roomMemberParams.dto';
import { MemberService } from './member.service';
import { RoomService } from '../room.service';
import { User } from 'src/user/decorators/user.decorator';

@Controller('rooms/:id/members')
@ApiTags('Members', 'Rooms')
@UseGuards(AuthGuard)
export class MemberController {
  constructor(
    private memberService: MemberService,
    private roomService: RoomService,
  ) {}

  @Get()
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

  @Get('/:memberId/validate')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth(SWAGGER_ENUM.AUTHORIZATION_HEADER)
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'already a member' })
  @ApiBadRequestResponse({
    description: 'wrong id, id of type nanoid(15)',
  })
  @ApiUnauthorizedResponse()
  async validateNewMember(
    @Param() params: roomMemberParamsDto,
    @User() user: IJwtPayload,
  ) {
    await this.roomService.getRoom(params.id);

    await this.memberService.validateMembership({
      adminId: user.id,
      roomId: params.id,
      memberId: params.memberId,
    });
  }
}
