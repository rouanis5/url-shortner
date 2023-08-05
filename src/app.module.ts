import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LinkModule } from './link/link.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';

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
    }),
    RoomModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
