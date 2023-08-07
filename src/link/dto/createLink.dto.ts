import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateLinkDTO {
  @ApiProperty({
    description: 'A valid URL',
    example: 'https://www.google.com/',
  })
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  url: string;

  @ApiProperty({
    description: 'Optional Expiration Date',
    example: new Date(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  expiresOn: Date;

  @ApiProperty({
    description: 'link is single use ? boolean (by default: false)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  singleUse: boolean;
}
