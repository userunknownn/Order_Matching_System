import { Injectable } from '@nestjs/common';
import {
  Notifier,
  NotifierEvent,
} from '../../shared/interfaces/notifier.interface';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketNotifier implements Notifier {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  notify(event: NotifierEvent): void {
    const { type, payload, userId } = event;

    switch (type) {
      case 'updateOrderBook':
        this.websocketGateway.emitUpdateOrderBook(event.payload);
        break;
      case 'updateGlobalMatches':
        this.websocketGateway.emitUpdateGlobalMatches(event.payload);
        break;
      case 'updateMyMatchHistory':
        this.websocketGateway.emitUpdateMyMatchHistory(
          event.payload.userId,
          event.payload.matches,
        );
        break;
      case 'updateStats':
        this.websocketGateway.emitUpdateStats(event.payload);
        break;
      case 'removeActiveOrder':
        this.websocketGateway.emitRemoveActiveOrder(
          event.payload.userId,
          event.payload.orderId,
        );
        break;
      case 'addActiveOrder':
        this.websocketGateway.emitAddActiveOrder(
          event.payload.userId,
          event.payload.order,
        );
        break;
      case 'updateUserBalances':
        this.websocketGateway.emitUpdateUserBalances(event.payload.userId, {
          usdBalance: event.payload.balances.usdBalance,
          btcBalance: event.payload.balances.btcBalance,
        });
        break;
    }
  }
}
