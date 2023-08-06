import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsTimeZone,
  Length,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsTimeZone()
  TZ: string;

  @IsNumber()
  APP_PORT: number;

  @IsNotEmpty()
  @Length(64)
  ACCESS_TOKEN_SECRET_KEY: string;

  //  database validation
  @IsString()
  DB_USER: string;
  @IsString()
  DB_PASS: string;
  @IsString()
  DB_NAME: string;
  @IsString()
  DB_HOST: string;
  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  DATABASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
