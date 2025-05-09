import { Match } from './match.entity';
import { CreateMatch } from './match.interface';

export abstract class MatchRepository {
  abstract create(match: CreateMatch): Promise<Match>;
  abstract findById(id: string): Promise<Match | null>;
  abstract findByOrderId(orderId: string): Promise<Match[]>;
  abstract findRecentMatches(limit?: number): Promise<Match[]>;
  abstract findMyRecentMatches(
    orderId: string,
    limit?: number,
  ): Promise<Match[]>;
  abstract findMatchesInLast24h(): Promise<Match[]>;
}
