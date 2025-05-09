import { OrderRepository } from '../../../domain/order/order.repository';
import { UserRepository } from '../../../domain/user/user.repository';
import { CreateOrder } from '../../../domain/order/order.interface';
import { User } from '../../../domain/user/user.entity';
import { Order } from '../../../domain/order/order.entity';
import { reserveUserBalance } from '../../../domain/user/user.service';
import { MatchOrderUseCase } from '../match/match-order.use-case';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly matchOrderUseCase: MatchOrderUseCase,
  ) {}

  async execute(order: CreateOrder) {
    let user: User | null = await this.userRepository.findById(order.userId);
    if (!user) throw new Error();

    try {
      user = reserveUserBalance(user, order.type, order.amount, order.price);
    } catch (error) {
      return;
    }
    const createdOrder = await this.orderRepository.create(order);

    const eventList: any[] = [];

    await this.userRepository.updateBalances(
      order.userId,
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

    const matchOrderUseCaseReturn =
      await this.matchOrderUseCase.execute(createdOrder);

    const activeOrders = await this.orderRepository.getAllActiveOrders();
    eventList.push({ type: 'updateOrderBook', payload: activeOrders });

    return {
      order: matchOrderUseCaseReturn.order,
      createOrderUseCaseEvents: eventList,
      matchOrderUseCaseEvents: matchOrderUseCaseReturn.eventList,
    };
  }
}
