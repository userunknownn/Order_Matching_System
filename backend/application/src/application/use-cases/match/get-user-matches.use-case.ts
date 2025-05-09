import { OrderRepository } from '../../../domain/order/order.repository';
import { MatchRepository } from '../../../domain/match/match.repository';

export class GetUserMatchesUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  async getUserMatches(userId: string) {
    const ordersFromUser = await this.orderRepository.getOrderHistory(userId);
    const orderIdsFromUser = ordersFromUser.map((order) => ({
      orderId: order.id,
      orderType: order.type,
    }));
    const userMatchesByOrder = await Promise.all(
      orderIdsFromUser.map(async (order) => {
        const matchs = await this.matchRepository.findMyRecentMatches(
          order.orderId,
          10
        );
        return {
          orderId: order.orderId,
          orderType: order.orderType,
          orderMatchs: matchs,
        };
      }),
    );

    const userMatchesInfo = userMatchesByOrder
      .map((orderInfo) =>
        orderInfo.orderMatchs.map((orderMatch) => ({
          orderId: orderInfo.orderId,
          matchId: orderMatch.id,
          type: orderInfo.orderType,
          price: orderMatch.price,
          volume: orderMatch.volume,
        })),
      )
      .flat();

    return userMatchesInfo;
  }
}
