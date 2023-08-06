import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

enum EnvironmentVariablesEnum {
  APP_PORT = 'APP_PORT',
  TZ = 'TZ',
  ACCESS_TOKEN_SECRET_KEY = 'ACCESS_TOKEN_SECRET_KEY',
}

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  getAppPort() {
    return this.configService.get<number>(EnvironmentVariablesEnum.APP_PORT);
  }

  getTimezone() {
    return this.configService.get<string>(EnvironmentVariablesEnum.TZ);
  }

  getAccessTokenSecretKey() {
    return this.configService.get<string>(
      EnvironmentVariablesEnum.ACCESS_TOKEN_SECRET_KEY,
    );
  }
}
