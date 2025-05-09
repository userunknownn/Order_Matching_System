import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketNotifier } from './websocket.notifier';

@Module({
  providers: [
    WebsocketGateway,
    WebsocketNotifier,
    {
      provide: 'Notifier',
      useExisting: WebsocketNotifier,
    },
  ],
  exports: ['Notifier'],
})
export class WebsocketModule {}
