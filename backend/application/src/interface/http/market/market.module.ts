import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { OrderModule } from '../order/order.module'; // se você quiser injetar OrderService ou repositório
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { OrderPrismaRepository } from '../../../infrastructure/prisma/repositories/order.prisma.repository';
import { OrderRepository } from '../../../domain/order/order.repository';
import { MatchPrismaRepository } from '../../../infrastructure/prisma/repositories/match.prisma.repository';
import { MatchRepository } from '../../../domain/match/match.repository';
import { GetUserMatchesUseCase } from '../../../application/use-cases/match/get-user-matches.use-case';

@Module({
  imports: [OrderModule],
  providers: [
    MarketService,
    {
      provide: GetUserMatchesUseCase,
      useFactory: (orderRepo: OrderRepository, matchRepo: MatchRepository) =>
        new GetUserMatchesUseCase(orderRepo, matchRepo),
      inject: [OrderRepository, MatchRepository],
    },
    PrismaService,
    {
      provide: OrderRepository,
      useClass: OrderPrismaRepository,
    },
    {
      provide: MatchRepository,
      useClass: MatchPrismaRepository,
    },
  ],
  controllers: [MarketController],
})
export class MarketModule {}
