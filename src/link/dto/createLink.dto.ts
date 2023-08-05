import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateLinkDTO {
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  url: string;

  @IsOptional()
  @IsDate()
  expiresOn: Date;

  @IsOptional()
  @IsBoolean()
  singleUse: boolean;
}
