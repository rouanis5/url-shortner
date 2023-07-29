import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  //enable CORS
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
