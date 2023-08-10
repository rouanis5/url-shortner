import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('rooms/members')
@ApiTags('Rooms', 'Room members')
export class MemberController {
  @Get()
  gethah() {
    return { message: 'hello' };
  }
}
