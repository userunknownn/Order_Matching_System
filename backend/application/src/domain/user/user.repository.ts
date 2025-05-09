import { User } from './user.entity';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(email: string): Promise<User>;
  abstract updateBalances(
    id: string,
    usdAvailable: number,
    btcAvailable: number,
    usdLocked: number,
    btcLocked: number,
  ): Promise<User>;
}
