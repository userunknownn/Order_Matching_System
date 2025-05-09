import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/user/user.repository';
import { User } from '../../../domain/user/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(email: string): Promise<User> {
    return this.userRepository.create(email);
  }

  async getUserBalances(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      btcBalance: user.btcAvailable,
      usdBalance: user.usdAvailable,
    };
  }
}
