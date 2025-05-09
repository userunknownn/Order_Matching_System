import { Controller, Post, Body, Req, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { RequestWithUser } from '../../../shared/interfaces/requestWithUser.interface';
import { CreateOrderDTO } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Req() req: RequestWithUser, @Body() body: CreateOrderDTO) {
    const userId = req.user.userId;

    return this.orderService.createOrder(userId, body);
  }

  @Get('active')
  async getAllActiveOrders() {
    return this.orderService.getAllActiveOrders();
  }

  @Get('me/active')
  async getMyActiveOrders(@Req() req: RequestWithUser) {
    return this.orderService.getMyActiveOrders(req.user.userId);
  }

  @Get('me/history')
  async getHistory(@Req() req: RequestWithUser) {
    return this.orderService.getOrderHistory(req.user.userId);
  }

  @Patch(':orderId/cancel')
  async cancelOrder(
    @Req() req: RequestWithUser,
    @Param('orderId') orderId: string,
  ) {
    const userId = req.user.userId;
    await this.orderService.cancelOrder(orderId, userId);
    return { success: true };
  }
}
