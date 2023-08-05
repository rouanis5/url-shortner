import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ApiConfigService } from './api-config/api-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());
  app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  //enable CORS
  app.enableCors();
  // get app port
  const apiConfigService = app.get(ApiConfigService);
  const port = apiConfigService.getAppPort();

  await app.listen(port);
}

bootstrap();
