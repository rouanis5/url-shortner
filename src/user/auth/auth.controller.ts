import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
  }

  @Post('signin')
  async signin(@Body() body: SignInDto) {
    await this.authService.signIn(body);
  }
}
