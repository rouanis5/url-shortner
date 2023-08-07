import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class LinksCountResponse {
  @ApiProperty({
    description: 'amount of saved links',
    example: 23,
  })
  count: number;
}

export class AddLinkResponse {
  @ApiProperty({
    description: 'unique id',
    example: 'AYo4fx6l5CfwMN6',
  })
  id: string;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    example: new Date(),
    required: false,
  })
  expiresOn: Date;

  @ApiProperty({
    example: false,
  })
  singleUse: boolean;

  @ApiProperty({
    example: 'https://www.google.com/',
  })
  url: string;

  @Exclude()
  private: boolean;
  @Exclude()
  roomId: string;
  @Exclude()
  userId: string;

  constructor(partial: Partial<AddLinkResponse>) {
    Object.assign(this, partial);
  }
}
