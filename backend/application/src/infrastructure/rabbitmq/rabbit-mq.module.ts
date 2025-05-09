import { Module, OnModuleInit } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQService } from './rabbit-mq.service';
import { OrderConsumer } from './consumers/order.consumer';

import { PrismaService } from '../prisma/prisma.service';
import { OrderRepository } from '../../domain/order/order.repository';
import { UserRepository } from '../../domain/user/user.repository';
import { MatchRepository } from '../../domain/match/match.repository';
import { FeeRepository } from '../../domain/fee/fee.repository';

import { OrderPrismaRepository } from '../prisma/repositories/order.prisma.repository';
import { UserPrismaRepository } from '../prisma/repositories/user.prisma.repository';
import { MatchPrismaRepository } from '../prisma/repositories/match.prisma.repository';
import { FeePrismaRepository } from '../prisma/repositories/fee.prisma.repository';

import { MatchOrderUseCase } from '../../application/use-cases/match/match-order.use-case';
import { CreateOrderUseCase } from '../../application/use-cases/order/create-order.use-case';
import { CancelOrderUseCase } from '../../application/use-cases/order/cancel-order.use-case';
import { GetUserMatchesUseCase } from '../../application/use-cases/match/get-user-matches.use-case';

import { WebsocketModule } from '../websocket/websocket.module';
import { MarketService } from '../../interface/http/market/market.service';

import { Notifier } from '../../shared/interfaces/notifier.interface';

@Module({
  imports: [WebsocketModule, ScheduleModule.forRoot()],
  providers: [
    RabbitMQService,
    PrismaService,
    MarketService,

    {
      provide: OrderRepository,
      useClass: OrderPrismaRepository,
    },
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: MatchRepository,
      useClass: MatchPrismaRepository,
    },
    {
      provide: FeeRepository,
      useClass: FeePrismaRepository,
    },

    {
      provide: MatchOrderUseCase,
      useFactory: (
        userRepository: UserRepository,
        orderRepository: OrderRepository,
        matchRepository: MatchRepository,
        feeRepository: FeeRepository,
        getUserMatchesUseCase: GetUserMatchesUseCase,
      ) =>
        new MatchOrderUseCase(
          userRepository,
          orderRepository,
          matchRepository,
          feeRepository,
          getUserMatchesUseCase,
        ),
      inject: [
        UserRepository,
        OrderRepository,
        MatchRepository,
        FeeRepository,
        GetUserMatchesUseCase,
      ],
    },
    {
      provide: CreateOrderUseCase,
      useFactory: (
        orderRepository: OrderRepository,
        userRepository: UserRepository,
        matchOrderUseCase: MatchOrderUseCase,
      ) =>
        new CreateOrderUseCase(
          orderRepository,
          userRepository,
          matchOrderUseCase,
        ),
      inject: [OrderRepository, UserRepository, MatchOrderUseCase],
    },
    {
      provide: GetUserMatchesUseCase,
      useFactory: (orderRepo: OrderRepository, matchRepo: MatchRepository) =>
        new GetUserMatchesUseCase(orderRepo, matchRepo),
      inject: [OrderRepository, MatchRepository],
    },
    {
      provide: CancelOrderUseCase,
      useFactory: (
        orderRepository: OrderRepository,
        userRepository: UserRepository,
        matchRepository: MatchRepository,
      ) =>
        new CancelOrderUseCase(
          orderRepository,
          userRepository,
          matchRepository,
        ),
      inject: [OrderRepository, UserRepository, MatchRepository],
    },

    {
      provide: OrderConsumer,
      useFactory: (
        rabbitMQService: RabbitMQService,
        cancelOrderUseCase: CancelOrderUseCase,
        createOrderUseCase: CreateOrderUseCase,
        notifier: Notifier,
      ) => {
        return new OrderConsumer(
          notifier,
          rabbitMQService,
          cancelOrderUseCase,
          createOrderUseCase,
        );
      },
      inject: [
        RabbitMQService,
        CancelOrderUseCase,
        CreateOrderUseCase,
        'Notifier',
      ],
    },
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
