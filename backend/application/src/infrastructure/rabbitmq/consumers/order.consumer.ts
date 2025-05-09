import { Injectable, Inject } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { RabbitMQService } from '../rabbit-mq.service';
import { CancelOrderUseCase } from '../../../application/use-cases/order/cancel-order.use-case';
import { CreateOrderUseCase } from '../../../application/use-cases/order/create-order.use-case';
import { Notifier } from '../../../shared/interfaces/notifier.interface';

@Injectable()
export class OrderConsumer {
  constructor(
    @Inject('Notifier') private readonly notifier: Notifier,
    private readonly rabbitMQService: RabbitMQService,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
  ) {}

  @Interval(2000)
  private async processQueues() {
    const channel = this.rabbitMQService.getChannel();
    let cancelMsg;
    do {
      cancelMsg = await channel.get('cancel_order_queue', { noAck: false });
      if (cancelMsg) {
        try {
          const { orderId, userId } = JSON.parse(cancelMsg.content.toString());
          const useCaseResult =
            await this.cancelOrderUseCase.cancelOrder(orderId);
          useCaseResult.eventList.map((event) => this.notifier.notify(event));
          channel.ack(cancelMsg);
        } catch (err) {
          console.error('An error occured on order cancel', err);
          channel.nack(cancelMsg);
        }
      }
    } while (cancelMsg);

    const createMsg = await channel.get('create_order_queue', { noAck: false });
    if (createMsg) {
      try {
        const order = JSON.parse(createMsg.content.toString());
        const useCaseResult = await this.createOrderUseCase.execute(order);

        if (useCaseResult) {
          useCaseResult.createOrderUseCaseEvents.forEach((event) =>
            this.notifier.notify(event),
          );
          useCaseResult.matchOrderUseCaseEvents.forEach((event) =>
            this.notifier.notify(event),
          );
          channel.ack(createMsg);
        } else {
          console.warn('Insufficient balance - user: ', order.userId);
          channel.ack(createMsg);
        }
      } catch (err) {
        console.error('Erro ao processar mensagem:', err.message);
        channel.nack(createMsg, false, false);
      }
    }
  }
}
