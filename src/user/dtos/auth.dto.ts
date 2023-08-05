import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  password: string;
}
