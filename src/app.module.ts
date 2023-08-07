import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LinkModule } from './link/link.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { validate } from './config/env.validation';
import { ApiConfigModule } from './api-config/api-config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    PrismaModule,
    LinkModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    RoomModule,
    UserModule,
    ApiConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
