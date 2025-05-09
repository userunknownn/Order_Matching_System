import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MatchRepository } from '../../../domain/match/match.repository';
import { CreateMatch } from '../../../domain/match/match.interface';
import { Match } from '../../../domain/match/match.entity';

@Injectable()
export class MatchPrismaRepository implements MatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMatch): Promise<Match> {
    const match = await this.prisma.orderMatch.create({
      data,
    });

    return {
      id: match.id,
      buyOrderId: match.buyOrderId,
      sellOrderId: match.sellOrderId,
      price: match.price,
      volume: match.volume,
      timestamp: match.timestamp,
    };
  }

  async findById(id: string): Promise<Match | null> {
    const match = await this.prisma.orderMatch.findUnique({
      where: { id },
    });

    if (!match) return null;

    return {
      id: match.id,
      buyOrderId: match.buyOrderId,
      sellOrderId: match.sellOrderId,
      price: match.price,
      volume: match.volume,
      timestamp: match.timestamp,
    };
  }

  async findByOrderId(orderId: string): Promise<Match[]> {
    const matches = await this.prisma.orderMatch.findMany({
      where: {
        OR: [{ buyOrderId: orderId }, { sellOrderId: orderId }],
      },
      orderBy: { timestamp: 'asc' },
    });

    return matches.map((match) => ({
      id: match.id,
      buyOrderId: match.buyOrderId,
      sellOrderId: match.sellOrderId,
      price: match.price,
      volume: match.volume,
      timestamp: match.timestamp,
    }));
  }

  async findMatchesInLast24h(): Promise<Match[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const matches = await this.prisma.orderMatch.findMany({
      where: {
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'desc' },
    });

    return matches.map((match) => ({
      id: match.id,
      buyOrderId: match.buyOrderId,
      sellOrderId: match.sellOrderId,
      price: match.price,
      volume: match.volume,
      timestamp: match.timestamp,
    }));
  }

  async findRecentMatches(limit: number = 50): Promise<Match[]> {
    const matches = await this.prisma.orderMatch.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return matches.map((match) => ({
      id: match.id,
      buyOrderId: match.buyOrderId,
      sellOrderId: match.sellOrderId,
      price: match.price,
      volume: match.volume,
      timestamp: match.timestamp,
    }));
  }

  async findMyRecentMatches(
    orderId: string,
    limit: number = 50,
  ): Promise<Match[]> {
    const matches = await this.prisma.orderMatch.findMany({
      where: {
        OR: [{ buyOrderId: orderId }, { sellOrderId: orderId }],
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return matches.map((match) => ({
      id: match.id,
      buyOrderId: match.buyOrderId,
      sellOrderId: match.sellOrderId,
      price: match.price,
      volume: match.volume,
      timestamp: match.timestamp,
    }));
  }
}
