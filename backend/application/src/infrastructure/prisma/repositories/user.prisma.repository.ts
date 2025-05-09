import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRepository } from '../../../domain/user/user.repository';
import { User } from '../../../domain/user/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string): Promise<User> {
    return await this.prisma.user.create({
      data: { email },
    });
  }

  async updateBalances(
    id: string,
    usdAvailable: number,
    btcAvailable: number,
    usdLocked: number,
    btcLocked: number,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: { usdAvailable, btcAvailable, usdLocked, btcLocked },
    });
  }
}
