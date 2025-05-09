import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderRepository } from '../../../domain/order/order.repository';
import { Order as DomainOrder } from '../../../domain/order/order.entity';
import { CreateOrder } from '../../../domain/order/order.interface';
import { OrderStatus, OrderType } from '../../../domain/order/order.enum';
import {
  Order as PrismaOrder,
  OrderStatus as PrismaOrderStatus,
  OrderType as PrismaOrderType,
} from '@prisma/client';

@Injectable()
export class OrderPrismaRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrder): Promise<DomainOrder> {
    const created = await this.prisma.order.create({
      data: {
        userId: data.userId,
        type: data.type as PrismaOrderType,
        amount: data.amount,
        price: data.price,
        status: PrismaOrderStatus.ACTIVE,
        remainingAmount: data.amount,
      },
    });

    return this.toDomain(created);
  }

  async getAllActiveOrders(): Promise<DomainOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: { status: PrismaOrderStatus.ACTIVE },
    });

    return orders.map(this.toDomain);
  }

  async getMyActiveOrders(userId: string): Promise<DomainOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId: userId, status: PrismaOrderStatus.ACTIVE },
    });

    return orders.map(this.toDomain);
  }

  async cancelOrder(orderId: string, userId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (
      !order ||
      order.userId !== userId ||
      order.status !== PrismaOrderStatus.ACTIVE
    ) {
      throw new Error('Ordem não encontrada ou já finalizada');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: PrismaOrderStatus.CANCELLED },
    });
  }

  async getOrderHistory(userId: string): Promise<any[]> {
    return await this.prisma.order.findMany({
      where: {
        userId,
        OR: [{ buyMatches: { some: {} } }, { sellMatches: { some: {} } }],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMatchedInLast24h(): Promise<DomainOrder[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { buyMatches: { some: { timestamp: { gte: since } } } },
          { sellMatches: { some: { timestamp: { gte: since } } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(this.toDomain);
  }

  async findMatchingSellOrders(price: number): Promise<DomainOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        type: PrismaOrderType.SELL,
        status: PrismaOrderStatus.ACTIVE,
        price: { lte: price },
        remainingAmount: { gt: 0 },
      },
      orderBy: { price: 'asc' },
    });

    return orders.map(this.toDomain);
  }

  async findMatchingBuyOrders(price: number): Promise<DomainOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        type: PrismaOrderType.BUY,
        status: PrismaOrderStatus.ACTIVE,
        price: { gte: price },
        remainingAmount: { gt: 0 },
      },
      orderBy: { price: 'desc' },
    });

    return orders.map(this.toDomain);
  }

  async update(order: DomainOrder): Promise<DomainOrder> {
    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: order.status as PrismaOrderStatus,
        remainingAmount: order.remainingAmount,
      },
    });

    return this.toDomain(updated);
  }

  async findById(orderId: string): Promise<DomainOrder | null> {
    const found = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    return found ? this.toDomain(found) : null;
  }

  private toDomain(prismaOrder: PrismaOrder): DomainOrder {
    return {
      id: prismaOrder.id,
      userId: prismaOrder.userId,
      type: prismaOrder.type as OrderType,
      amount: prismaOrder.amount,
      price: prismaOrder.price,
      remainingAmount: prismaOrder.remainingAmount,
      status: prismaOrder.status as OrderStatus,
      createdAt: prismaOrder.createdAt,
    };
  }
}
