import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDTO } from './dto/createLink.dto';
import { IdDTO } from './dto/id.dto';
import { SkipThrottle } from '@nestjs/throttler';
@SkipThrottle()
@Controller('links')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Get('/')
  getLinks() {
    return { message: 'i am a dragon' };
  }

  @Get('/count')
  getCount() {
    return this.linkService.getCount();
  }

  @SkipThrottle(false)
  @Post('/')
  addLink(@Body() body: CreateLinkDTO) {
    return this.linkService.add(body.url);
  }

  @Get('/:id')
  getLinkById(@Param() parms: IdDTO) {
    try {
      return this.linkService.getById(parms.id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
