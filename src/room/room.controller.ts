import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('rooms')
@ApiTags('Rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('welcome')
  welcome() {
    return this.roomService.welcome();
  }
}
