import { OrderStatus } from './order.enum';

export interface Order {
  id: string;
  userId: string;
  type: string;
  amount: number;
  price: number;
  status: OrderStatus;
  remainingAmount: number;
  createdAt: Date;
}
