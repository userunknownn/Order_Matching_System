import { Injectable, Inject } from '@nestjs/common';
import { OrderRepository } from '../../../domain/order/order.repository';
import { Order } from '../../../domain/order/order.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { RabbitMQService } from '../../../infrastructure/rabbitmq/rabbit-mq.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async createOrder(userId: string, order: CreateOrderDTO): Promise<void> {
    await this.rabbitmqService.publishOnCreateOrder({ userId, ...order });
  }

  async getAllActiveOrders(): Promise<Order[]> {
    return this.orderRepository.getAllActiveOrders();
  }

  async getMyActiveOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.getMyActiveOrders(userId);
  }

  async cancelOrder(orderId: string, userId: string): Promise<void> {
    await this.rabbitmqService.publishOnCancelOrder(orderId, userId);
  }

  async getOrderHistory(userId: string): Promise<Order[]> {
    return this.orderRepository.getOrderHistory(userId);
  }
}
