import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

// TODO: add config module to nestJs

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: 'this is gonna be changed later',
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
})
export class AuthModule {}
