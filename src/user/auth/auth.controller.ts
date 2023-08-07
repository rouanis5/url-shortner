import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, SignInDto, SignUpDto } from '../dtos';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'user signup successsfully and gets a token',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'wrong credantials',
  })
  @ApiUnauthorizedResponse({
    description: 'unauthorized',
  })
  async signup(@Body() body: SignUpDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  @ApiCreatedResponse({
    description: 'user sign in successsfully and gets a token',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'wrong credantials',
  })
  @ApiUnauthorizedResponse({
    description: 'unauthorized',
  })
  async signin(@Body() body: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(body);
  }
}
