import { OrderType } from './order.enum';

export interface CreateOrder {
  userId: string;
  type: OrderType;
  amount: number;
  price: number;
}
