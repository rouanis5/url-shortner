import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsString } from 'class-validator';

export class MemberResponseDto {
  @Exclude()
  id: string;

  @ApiProperty({
    example: 'Mam4fx6l5CfwMN4',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'o@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isActivated: boolean;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  isBanned: boolean;

  @ApiProperty({
    example: 'AYo4fx6l5CfwMN6',
  })
  @IsString()
  roomId: string;

  constructor(partial: Partial<MemberResponseDto>) {
    Object.assign(this, partial);
  }
}
