import { Fee } from './fee.entity';
import { CreateFee } from './fee.interface';

export abstract class FeeRepository {
  abstract create(fee: Fee): Promise<Fee>;
  abstract findByUserId(userId: string): Promise<Fee[]>;
  abstract findByMatchId(matchId: string): Promise<Fee[]>;
  abstract createMany(data: CreateFee[]): Promise<void>;
}
