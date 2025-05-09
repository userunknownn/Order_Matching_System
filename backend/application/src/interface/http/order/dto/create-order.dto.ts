import { OrderType } from '../../../../domain/order/order.enum';

export interface CreateOrderDTO {
  type: OrderType;
  amount: number;
  price: number;
}
