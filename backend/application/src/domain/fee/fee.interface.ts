import { FeeRole } from './fee.enum';

export interface CreateFee {
  userId: string;
  matchId: string;
  role: FeeRole;
  amount: number;
}
