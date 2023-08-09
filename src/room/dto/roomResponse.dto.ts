import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class RoomResponseDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'unique id',
    example: 'AYo4fx6l5CfwMN6',
  })
  id: string;

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
    example: 'lp legends',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  private: boolean;

  constructor(partial: Partial<RoomResponseDto>) {
    Object.assign(this, partial);
  }
}
