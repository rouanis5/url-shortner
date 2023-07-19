import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateLinkDTO {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
