import { Module } from '@nestjs/common';
import { RabbitMQModule } from './infrastructure/rabbitmq/rabbit-mq.module';
import { AuthModule } from './interface/http/auth/auth.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { WebsocketModule } from './infrastructure/websocket/websocket.module';

@Module({
  imports: [AuthModule, PrismaModule, WebsocketModule, RabbitMQModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
