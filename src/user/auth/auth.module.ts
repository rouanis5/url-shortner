import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from 'src/api-config/api-config.service';
import { ApiConfigModule } from 'src/api-config/api-config.module';

// TODO: add config module to nestJs

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      useFactory: async (apiConfigService: ApiConfigService) => {
        return {
          secret: apiConfigService.getAccessTokenSecretKey(),
          signOptions: {
            expiresIn: '5m',
          },
        };
      },
      inject: [ApiConfigService],
    }),
  ],
})
export class AuthModule {}
