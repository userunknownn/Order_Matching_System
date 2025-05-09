import { Controller, Get, Req } from '@nestjs/common';
import { MarketService } from './market.service';
import { RequestWithUser } from '../../../shared/interfaces/requestWithUser.interface';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('statistics')
  async getStatistics() {
    return this.marketService.getMarketStats();
  }

  @Get('matches/recent')
  async getRecentMatches() {
    return this.marketService.getRecentMatches();
  }

  @Get('me/matches/recent')
  async getMyRecentMatches(@Req() req: RequestWithUser) {
    return this.marketService.getMyRecentMatches(req.user.userId);
  }
}
