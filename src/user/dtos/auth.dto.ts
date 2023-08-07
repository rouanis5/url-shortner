import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'o@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password should be strong',
    example: 'Password1234%',
  })
  @IsStrongPassword({
    minLength: 6,
  })
  password: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'o@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password should be strong',
    example: 'Password1234%',
  })
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token is returned',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
