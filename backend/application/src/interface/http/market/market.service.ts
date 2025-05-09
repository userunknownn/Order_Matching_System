import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../../domain/order/order.repository';
import { MatchRepository } from '../../../domain/match/match.repository';
import { getStatsBasedOnMatches } from '../../../domain/match/match.service';
import { GetUserMatchesUseCase } from '../../../application/use-cases/match/get-user-matches.use-case';
import { MarketStats } from './dto/market-stats.dto';

@Injectable()
export class MarketService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly getUserMatchesUseCase: GetUserMatchesUseCase,
  ) {}

  async getMarketStats(): Promise<MarketStats> {
    const matchedOrders = await this.matchRepository.findMatchesInLast24h();
    return getStatsBasedOnMatches(matchedOrders);
  }

  async getRecentMatches() {
    return await this.matchRepository.findRecentMatches(10);
  }

  async getMyRecentMatches(userId: string) {
    return this.getUserMatchesUseCase.getUserMatches(userId);
  }
}
