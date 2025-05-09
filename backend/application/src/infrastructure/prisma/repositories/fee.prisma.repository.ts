import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FeeRepository } from '../../../domain/fee/fee.repository';
import { CreateFee } from '../../../domain/fee/fee.interface';
import { Fee } from '../../../domain/fee/fee.entity';
import { FeeRole } from '../../../domain/fee/fee.enum';

import { Fee as PrismaFee, FeeRole as PrismaFeeRole } from '@prisma/client';

@Injectable()
export class FeePrismaRepository implements FeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Fee): Promise<Fee> {
    const created = await this.prisma.fee.create({
      data: {
        userId: data.userId,
        matchId: data.matchId,
        amount: data.amount,
        role: data.role as PrismaFeeRole,
      },
    });

    return this.toDomain(created);
  }

  async createMany(data: CreateFee[]): Promise<void> {
    await this.prisma.fee.createMany({
      data: data.map((fee) => ({
        userId: fee.userId,
        matchId: fee.matchId,
        amount: fee.amount,
        role: fee.role as PrismaFeeRole,
      })),
    });
  }

  async findByUserId(userId: string): Promise<Fee[]> {
    const fees = await this.prisma.fee.findMany({
      where: { userId },
    });

    return fees.map(this.toDomain);
  }

  async findByMatchId(matchId: string): Promise<Fee[]> {
    const fees = await this.prisma.fee.findMany({
      where: { matchId },
    });

    return fees.map(this.toDomain);
  }

  private toDomain(prismaFee: PrismaFee): Fee {
    return {
      id: prismaFee.id,
      userId: prismaFee.userId,
      matchId: prismaFee.matchId,
      amount: prismaFee.amount,
      role: prismaFee.role as FeeRole,
      createdAt: prismaFee.createdAt,
    };
  }
}
