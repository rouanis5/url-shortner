import { Controller, Get } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('links')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Get()
  getLinks() {
    return { message: 'i am a dragon' };
  }

  @Get('/count')
  getCount() {
    return this.linkService.getCount();
  }
}
