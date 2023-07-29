import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  welcome() {
    return { message: 'welcome to Rooms' };
  }
}
