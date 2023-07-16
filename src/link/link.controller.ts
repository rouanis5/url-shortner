import { Controller, Get } from '@nestjs/common';

@Controller('links')
export class LinkController {
  @Get()
  getLinks() {
    return { message: 'i am a dragon' };
  }
}
