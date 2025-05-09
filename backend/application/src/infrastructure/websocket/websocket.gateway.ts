import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { validateSocketToken } from '../../shared/utils/token.validator';
import { Notifier } from '../../shared/interfaces/notifier.interface';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, Notifier
{
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (!token) {
      console.log('No token provided');
      client.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, 'your_secret_key_here') as {
        sub: string;
        email: string;
      };

      const userId = decoded.sub;
      client.data.userId = userId;
      client.join(userId);

      console.log(`Client ${client.id} connected as user ${userId}`);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.warn('Token expired, disconnecting client:', client.id);
        client.emit('tokenExpired');
      } else {
        console.error('Invalid token:', err.message);
      }

      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitUpdateUserBalances(
    userId: string,
    balances: { usdBalance: number; btcBalance: number },
  ) {
    this.server.to(userId).emit('updateUserBalances', { payload: balances });
  }

  emitUpdateStats(stats: any) {
    this.server.emit('updateStats', { payload: stats });
  }

  emitUpdateOrderBook(activeOrders: any) {
    this.server.emit('updateOrderBook', { payload: activeOrders });
  }

  emitAddActiveOrder(userId: string, order: any) {
    this.server.to(userId).emit('addActiveOrder', { payload: order });
  }

  emitRemoveActiveOrder(userId: string, orderId: string) {
    this.server.to(userId).emit('removeActiveOrder', { payload: orderId });
  }

  emitUpdateGlobalMatches(globalMatches: any) {
    this.server.emit('updateGlobalMatches', { payload: globalMatches });
  }

  emitUpdateMyMatchHistory(userId: string, myMatches: any) {
    this.server.to(userId).emit('updateMyMatchHistory', { payload: myMatches });
  }

  async notify(event: {
    type: string;
    payload: any;
    userId?: string;
  }): Promise<void> {
    if (event.userId) {
      this.server.to(event.userId).emit(event.type, { payload: event.payload });
    } else {
      this.server.emit(event.type, { payload: event.payload });
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;

    try {
      const decoded = validateSocketToken(token, 'your_secret_key_here');
      return { event: 'pong', data: `pong from ${decoded.email}` };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        client.emit('tokenExpired');
      } else {
        client.emit('invalidToken');
      }
      client.disconnect();
    }
  }
}
