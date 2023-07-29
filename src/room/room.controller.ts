import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('welcome')
  welcome() {
    return this.roomService.welcome();
  }
}
