import { IsString, Length } from 'class-validator';

export class roomMemberParamsDto {
  @IsString()
  @Length(15, 15)
  id: string;

  @IsString()
  @Length(15, 15)
  memberId: string;
}
