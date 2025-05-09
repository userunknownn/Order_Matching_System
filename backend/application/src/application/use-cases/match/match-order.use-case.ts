import { Order } from '../../../domain/order/order.entity';
import { OrderStatus } from '../../../domain/order/order.enum';
import { UserRepository } from '../../../domain/user/user.repository';
import { OrderRepository } from '../../../domain/order/order.repository';
import { MatchRepository } from '../../../domain/match/match.repository';
import { getStatsBasedOnMatches } from '../../../domain/match/match.service';
import { FeeRepository } from '../../../domain/fee/fee.repository';
import { FeeRole } from '../../../domain/fee/fee.enum';
import { GetUserMatchesUseCase } from './get-user-matches.use-case';

export class MatchOrderUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly matchRepository: MatchRepository,
    private readonly feeRepository: FeeRepository,
    private readonly getUserMatchesUseCase: GetUserMatchesUseCase,
  ) {}

  async execute(order: Order) {
    const makerFee = 0.005;
    const takerFee = 0.003;

    const eventList: any[] = [];

    if (order.type === 'BUY') {

      const sellOrders = await this.orderRepository.findMatchingSellOrders(
        order.price,
      );

      for (const sellOrder of sellOrders) {
        if (order.remainingAmount == 0) {
          order.status = OrderStatus.COMPLETED;
          break;
        }

        if (order.userId == sellOrder.userId) continue;

        const volume = Math.min(
          order.remainingAmount,
          sellOrder.remainingAmount,
        );

        const matchPrice = volume * sellOrder.price;

        const match = await this.matchRepository.create({
          buyOrderId: order.id,
          sellOrderId: sellOrder.id,
          price: matchPrice,
          volume,
        });

        const globalMatches = await this.matchRepository.findRecentMatches(10);
        eventList.push({ type: 'updateGlobalMatches', payload: globalMatches });

        const recentMarketStats = getStatsBasedOnMatches(
          await this.matchRepository.findMatchesInLast24h(),
        );
        eventList.push({ type: 'updateStats', payload: recentMarketStats });

        const buyOrderUserMatches =
          await this.getUserMatchesUseCase.getUserMatches(order.userId);
        eventList.push({
          type: 'updateMyMatchHistory',
          payload: { userId: order.userId, matches: buyOrderUserMatches },
        });

        const sellOrderUserMatches =
          await this.getUserMatchesUseCase.getUserMatches(sellOrder.userId);
        eventList.push({
          type: 'updateMyMatchHistory',
          payload: { userId: sellOrder.userId, matches: sellOrderUserMatches },
        });

        const buyerFee = volume * takerFee;
        const sellerFee = matchPrice * makerFee;

        await this.feeRepository.createMany([
          {
            userId: order.userId,
            matchId: match.id,
            role: FeeRole.TAKER,
            amount: buyerFee,
          },
          {
            userId: sellOrder.userId,
            matchId: match.id,
            role: FeeRole.MAKER,
            amount: sellerFee,
          },
        ]);

        const buyOrderUser = await this.userRepository.findById(order.userId);
        const sellOrderUser = await this.userRepository.findById(
          sellOrder.userId,
        );

        if (!buyOrderUser || !sellOrderUser) throw new Error();

        const btcAvailableUpdate =
          volume - buyerFee + buyOrderUser.btcAvailable;
        const usdLockedUpdate = buyOrderUser.usdLocked - matchPrice;
        await this.userRepository.updateBalances(
          buyOrderUser.id,
          buyOrderUser.usdAvailable,
          btcAvailableUpdate,
          usdLockedUpdate,
          buyOrderUser.btcLocked,
        );

        eventList.push({
          type: 'updateUserBalances',
          payload: {
            userId: buyOrderUser.id,
            balances: {
              usdBalance: buyOrderUser.usdAvailable,
              btcBalance: btcAvailableUpdate,
            },
          },
        });

        const usdAvailableUpdate =
          matchPrice - sellerFee + sellOrderUser.usdAvailable;
        const btcLockedUpdate = sellOrderUser.btcLocked - volume;
        await this.userRepository.updateBalances(
          sellOrderUser.id,
          usdAvailableUpdate,
          sellOrderUser.btcAvailable,
          sellOrderUser.usdLocked,
          btcLockedUpdate,
        );

        eventList.push({
          type: 'updateUserBalances',
          payload: {
            userId: sellOrderUser.id,
            balances: {
              usdBalance: usdAvailableUpdate,
              btcBalance: sellOrderUser.btcAvailable,
            },
          },
        });

        sellOrder.remainingAmount -= volume;
        order.remainingAmount -= volume;

        if (sellOrder.remainingAmount == 0)
          sellOrder.status = OrderStatus.COMPLETED;
        if (order.remainingAmount == 0) order.status = OrderStatus.COMPLETED;

        await this.orderRepository.update(sellOrder);

        if (sellOrder.remainingAmount == 0) {
          eventList.push({
            type: 'removeActiveOrder',
            payload: { userId: sellOrder.userId, orderId: sellOrder.id },
          });
        }
      }
    } else {

      const buyOrders = await this.orderRepository.findMatchingBuyOrders(
        order.price,
      );


      for (const buyOrder of buyOrders) {
        if (order.remainingAmount == 0) {
          order.status = OrderStatus.COMPLETED;
          break;
        }

        if (order.userId == buyOrder.userId) continue; 

        const volume = Math.min(
          order.remainingAmount,
          buyOrder.remainingAmount,
        );

        const matchPrice = volume * buyOrder.price;

        const match = await this.matchRepository.create({
          buyOrderId: buyOrder.id,
          sellOrderId: order.id,
          price: matchPrice,
          volume,
        });

        const globalMatches = await this.matchRepository.findRecentMatches(10);
        eventList.push({ type: 'updateGlobalMatches', payload: globalMatches });

        const recentMarketStats = getStatsBasedOnMatches(
          await this.matchRepository.findMatchesInLast24h(),
        );
        eventList.push({ type: 'updateStats', payload: recentMarketStats });

        const buyOrderUserMatches =
          await this.getUserMatchesUseCase.getUserMatches(buyOrder.userId);
        eventList.push({
          type: 'updateMyMatchHistory',
          payload: { userId: buyOrder.userId, matches: buyOrderUserMatches },
        });

        const sellOrderUserMatches =
          await this.getUserMatchesUseCase.getUserMatches(order.userId);
        eventList.push({
          type: 'updateMyMatchHistory',
          payload: { userId: order.userId, matches: sellOrderUserMatches },
        });

        const buyerFee = volume * makerFee;
        const sellerFee = matchPrice * takerFee;

        await this.feeRepository.createMany([
          {
            userId: order.userId,
            matchId: match.id,
            role: FeeRole.TAKER,
            amount: sellerFee,
          },
          {
            userId: buyOrder.userId,
            matchId: match.id,
            role: FeeRole.MAKER,
            amount: buyerFee,
          },
        ]);

        const sellOrderUser = await this.userRepository.findById(order.userId);
        const buyOrderUser = await this.userRepository.findById(
          buyOrder.userId,
        );

        if (!buyOrderUser || !sellOrderUser) throw new Error();

        const btcAvailableUpdate =
          volume - buyerFee + buyOrderUser.btcAvailable;
        const usdLockedUpdate = buyOrderUser.usdLocked - matchPrice;
        await this.userRepository.updateBalances(
          buyOrderUser.id,
          buyOrderUser.usdAvailable,
          btcAvailableUpdate,
          usdLockedUpdate,
          buyOrderUser.btcLocked,
        );

        eventList.push({
          type: 'updateUserBalances',
          payload: {
            userId: buyOrderUser.id,
            balances: {
              usdBalance: buyOrderUser.usdAvailable,
              btcBalance: btcAvailableUpdate,
            },
          },
        });

        const usdAvailableUpdate =
          matchPrice - sellerFee + sellOrderUser.usdAvailable;
        const btcLockedUpdate = sellOrderUser.btcLocked - volume;
        await this.userRepository.updateBalances(
          sellOrderUser.id,
          usdAvailableUpdate,
          sellOrderUser.btcAvailable,
          sellOrderUser.usdLocked,
          btcLockedUpdate,
        );

        eventList.push({
          type: 'updateUserBalances',
          payload: {
            userId: sellOrderUser.id,
            balances: {
              usdBalance: usdAvailableUpdate,
              btcBalance: sellOrderUser.btcAvailable,
            },
          },
        });

        buyOrder.remainingAmount -= volume;
        order.remainingAmount -= volume;

        if (buyOrder.remainingAmount == 0)
          buyOrder.status = OrderStatus.COMPLETED;
        if (order.remainingAmount == 0) order.status = OrderStatus.COMPLETED;

        await this.orderRepository.update(buyOrder);

        if (buyOrder.remainingAmount == 0) {
          eventList.push({
            type: 'removeActiveOrder',
            payload: { userId: buyOrder.userId, orderId: buyOrder.id },
          });
        }
      }
    }

    await this.orderRepository.update(order);

    if (order.remainingAmount == 0) {
      eventList.push({
        type: 'removeActiveOrder',
        payload: { userId: order.userId, orderId: order.id },
      });
    } else {
      eventList.push({
        type: 'addActiveOrder',
        payload: { userId: order.userId, order },
      });
    }

    return {
      order,
      eventList,
    };
  }
}
