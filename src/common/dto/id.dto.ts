/**
 * i prefer to use Zod library, later i'll follow this guide:
 * https://github.com/anatine/zod-plugins/tree/main/packages/zod-nestjs
 */
import { IsString, Length } from 'class-validator';

export class IdDTO {
  @IsString()
  @Length(15, 15)
  id: string;
}
