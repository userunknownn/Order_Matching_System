import { Order } from './order.entity';
import { CreateOrder } from './order.interface';

export abstract class OrderRepository {
  abstract create(order: CreateOrder): Promise<Order>;
  abstract getAllActiveOrders(): Promise<Order[]>;
  abstract getMyActiveOrders(userId: string): Promise<Order[]>;
  abstract cancelOrder(orderId: string, userId: string): Promise<void>;
  abstract getOrderHistory(userId: string): Promise<any[]>;
  abstract findMatchedInLast24h(): Promise<Order[]>;
  abstract findMatchingSellOrders(price: number): Promise<Order[]>;
  abstract findMatchingBuyOrders(price: number): Promise<Order[]>;
  abstract findById(orderId: string): Promise<Order | null>;
  abstract update(order: Order): Promise<Order>;
}
