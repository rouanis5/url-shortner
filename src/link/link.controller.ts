import {
  Body,
  Controller,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDTO } from './dto/createLink.dto';
import { IdDTO } from './dto/id.dto';
import { SkipThrottle } from '@nestjs/throttler';
import dayjs from 'dayjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AddLinkResponse, LinksCountResponse } from './dto/responses.dto';

@ApiTags('Links')
@SkipThrottle()
@Controller('links')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Post('/')
  @ApiCreatedResponse({
    description: 'link created successfully',
    type: AddLinkResponse,
  })
  async addLink(@Body() body: CreateLinkDTO): Promise<AddLinkResponse> {
    const link = await this.linkService.add({
      url: body.url,
      expiresOn: body.expiresOn,
      singleUse: body.singleUse,
    });

    return new AddLinkResponse(link);
  }

  @SkipThrottle(false)
  @Get('/count')
  getCount(): Promise<LinksCountResponse> {
    return this.linkService.getCount();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY) // 301
  @Redirect()
  async getLinkById(@Param() params: IdDTO) {
    const link = await this.linkService.getById(params.id);

    if (!link) {
      throw new NotFoundException();
    }

    // delete if expired
    if (link.expiresOn && dayjs().isAfter(link.expiresOn)) {
      this.linkService.deleteById(params.id);
      throw new GoneException();
    }

    // delete if single urse
    if (link.singleUse === true) {
      this.linkService.deleteById(params.id);
    }

    return { url: link.url };
  }
}
