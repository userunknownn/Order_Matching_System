import { FeeRole } from './fee.enum';

export interface Fee {
  id: string;
  userId: string;
  matchId: string;
  role: FeeRole;
  amount: number;
  createdAt: Date;
}
