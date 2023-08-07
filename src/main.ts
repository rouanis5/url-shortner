import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ApiConfigService } from './api-config/api-config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NodeEnvEnum } from './config/env.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());

  // request logger middlware
  app.use(morgan('tiny'));

  // enable validation pip
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // enable CORS
  app.enableCors();

  // get app port
  const apiConfigService = app.get(ApiConfigService);
  const port = apiConfigService.getAppPort();

  // swagger configuration
  // disable it on production mode
  const nodeEnvironemnt = apiConfigService.getNodeEnvironment();
  if (nodeEnvironemnt !== NodeEnvEnum.production) {
    const config = new DocumentBuilder()
      .setTitle('url shortner')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // start server
  await app.listen(port);
}

bootstrap();
