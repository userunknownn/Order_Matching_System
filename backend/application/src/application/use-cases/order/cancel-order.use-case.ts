import { OrderRepository } from '../../../domain/order/order.repository';
import { UserRepository } from '../../../domain/user/user.repository';
import { MatchRepository } from '../../../domain/match/match.repository';
import { User } from '../../../domain/user/user.entity';
import { refundUserBalance } from '../../../domain/user/user.service';
import { Order } from '../../../domain/order/order.entity';
import { OrderStatus } from '../../../domain/order/order.enum';

export class CancelOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  async cancelOrder(orderId: string) {
    const order: Order | null = await this.orderRepository.findById(orderId);

    if (!order) throw new Error();

    if (order.status != OrderStatus.ACTIVE) throw new Error();

    order.status = OrderStatus.CANCELLED;
    const cancelledOrder: Order = await this.orderRepository.update(order);

    const eventList: any[] = [];

    const activeOrders = await this.orderRepository.getAllActiveOrders();
    eventList.push({ type: 'updateOrderBook', payload: activeOrders });

    eventList.push({
      type: 'removeActiveOrder',
      payload: { userId: order.userId, orderId: order.id },
    });

    let user: User | null = await this.userRepository.findById(order.userId);

    if (!user) throw new Error();

    const matches = await this.matchRepository.findByOrderId(order.id);

    user = refundUserBalance(user, order, matches);

    await this.userRepository.updateBalances(
      user.id,
      user.usdAvailable,
      user.btcAvailable,
      user.usdLocked,
      user.btcLocked,
    );

    eventList.push({
      type: 'updateUserBalances',
      payload: {
        userId: user.id,
        balances: {
          usdBalance: user.usdAvailable,
          btcBalance: user.btcAvailable,
        },
      },
    });

    return {
      order: cancelledOrder,
      eventList,
    };
  }
}
