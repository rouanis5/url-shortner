import { Module } from '@nestjs/common';
import { LinkService } from './link.service';

@Module({
  providers: [LinkService],
})
export class LinkModule {}
