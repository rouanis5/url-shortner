import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnvEnum } from 'src/config/env.type';

enum EnvironmentVariablesEnum {
  APP_PORT = 'APP_PORT',
  TZ = 'TZ',
  ACCESS_TOKEN_SECRET_KEY = 'ACCESS_TOKEN_SECRET_KEY',
  NODE_ENV = 'NODE_ENV',
}

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  getAppPort(): number {
    return this.configService.get<number>(EnvironmentVariablesEnum.APP_PORT);
  }

  getTimezone(): string {
    return this.configService.get<string>(EnvironmentVariablesEnum.TZ);
  }

  getAccessTokenSecretKey(): string {
    return this.configService.get<string>(
      EnvironmentVariablesEnum.ACCESS_TOKEN_SECRET_KEY,
    );
  }

  getNodeEnvironment(): NodeEnvEnum {
    return this.configService.get<NodeEnvEnum>(
      EnvironmentVariablesEnum.NODE_ENV,
    );
  }
}
