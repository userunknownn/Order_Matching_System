import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly url = 'amqp://YOUR_USERNAME:YOUR_PASSWORD@rabbitmq:5672';

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('create_order_queue', { durable: true });
      await this.channel.assertQueue('cancel_order_queue', { durable: true });
    } catch (error) {
      throw error;
    }
  }

  getChannel(): amqp.Channel {
    if (!this.channel) throw new Error('Channel is not initialized.');
    return this.channel;
  }

  async publishOnCreateOrder(order: any) {
    this.getChannel().sendToQueue(
      'create_order_queue',
      Buffer.from(JSON.stringify(order)),
      { persistent: true },
    );
  }

  async publishOnCancelOrder(orderId: string, userId: string) {
    this.getChannel().sendToQueue(
      'cancel_order_queue',
      Buffer.from(JSON.stringify({ orderId, userId })),
      { persistent: true },
    );
  }

  async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
