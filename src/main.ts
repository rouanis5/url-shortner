import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { ApiConfigService } from './api-config/api-config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NodeEnvEnum } from './config/env.type';
import { SWAGGER_ENUM } from './common/enums';

async function bootstrap() {
  // use fastify instead of express
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
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
      .addBearerAuth(
        {
          // I was also testing it without prefix 'Bearer ' before the JWT
          description: `[just text field] Please enter token in following format: Bearer <JWT>`,
          name: 'Authorization',
          bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
          scheme: 'Bearer',
          type: 'http', // I`ve attempted type: 'apiKey' too
          in: 'Header',
        },
        SWAGGER_ENUM.AUTHORIZATION_HEADER, // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  // start server
  await app.listen(port);
}

bootstrap();
