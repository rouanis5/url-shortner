import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDTO } from './dto/createLink.dto';
import { IdDTO } from './dto/id.dto';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiMovedPermanentlyResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBadRequestResponse({
    description: 'bad request',
  })
  async addLink(@Body() body: CreateLinkDTO): Promise<AddLinkResponse> {
    const link = await this.linkService.add({
      url: body.url,
      expiresOn: body.expiresOn,
      singleUse: body.singleUse,
    });

    return new AddLinkResponse(link);
  }

  @Get('/count')
  @SkipThrottle(false)
  @ApiCreatedResponse({
    type: LinksCountResponse,
  })
  getCount(): Promise<LinksCountResponse> {
    return this.linkService.getCount();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY) // 301
  @Redirect()
  @ApiMovedPermanentlyResponse({
    description: 'redirect directly',
  })
  @ApiNotFoundResponse({
    description: 'not found',
  })
  async redirectToLinkById(@Param() params: IdDTO) {
    const link = await this.linkService.getById(params.id);

    return { url: link.url };
  }

  @Get('/:id/properties')
  @ApiCreatedResponse({
    description: 'link found',
    type: AddLinkResponse,
  })
  @ApiNotFoundResponse({
    description: 'not found',
  })
  async getLinkById(@Param() param: IdDTO) {
    const link = await this.linkService.getById(param.id);

    return new AddLinkResponse(link);
  }
}
