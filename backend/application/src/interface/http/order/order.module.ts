import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { OrderRepository } from '../../../domain/order/order.repository';
import { OrderPrismaRepository } from '../../../infrastructure/prisma/repositories/order.prisma.repository';
import { RabbitMQService } from '../../../infrastructure/rabbitmq/rabbit-mq.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    RabbitMQService,
    PrismaService,
    {
      provide: OrderRepository,
      useClass: OrderPrismaRepository,
    },
  ],
})
export class OrderModule {}
