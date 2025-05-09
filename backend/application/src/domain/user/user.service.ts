import { User } from './user.entity';
import { Order } from '../order/order.entity';
import { OrderType } from '../order/order.enum';
import { Match } from '../match/match.entity';

export function reserveUserBalance(
  user: User,
  orderType: OrderType,
  amount: number,
  price: number,
): User {
  if (orderType === OrderType.BUY) {
    const newOrderCost = amount * price;
    if (user.usdAvailable < newOrderCost) {
      throw new Error('Saldo insuficiente em USD');
    }

    return {
      ...user,
      usdAvailable: user.usdAvailable - newOrderCost,
      usdLocked: user.usdLocked + newOrderCost,
    };
  } else {
    if (user.btcAvailable < amount) {
      throw new Error('Saldo insuficiente em BTC');
    }

    return {
      ...user,
      btcAvailable: user.btcAvailable - amount,
      btcLocked: user.btcLocked + amount,
    };
  }
}

export function refundUserBalance(
  user: User,
  order: Order,
  matches: Match[],
): User {
  if (order.type === OrderType.BUY) {

    const orderUsdTotal = order.amount * order.price;
    let usdSpentOnMatches = 0;

    matches.forEach((match) => {
      usdSpentOnMatches += match.price;
    });

    const usdRefund = orderUsdTotal - usdSpentOnMatches;

    user.usdAvailable += usdRefund;
    user.usdLocked -= usdRefund;

    return {
      ...user,
      usdAvailable: user.usdAvailable,
      usdLocked: user.usdLocked,
    };
  } else {
    const btcRefund = order.remainingAmount;
    user.btcAvailable += btcRefund;
    user.btcLocked -= btcRefund;

    return {
      ...user,
      btcAvailable: user.btcAvailable,
      btcLocked: user.btcLocked,
    };
  }
}
