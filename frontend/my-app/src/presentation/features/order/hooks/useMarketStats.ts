import { useState } from "react";
import { fetchUserBalances } from "../../../../infrastructure/api/user/fetchUserBalances";
import { fetchMarketStatistics } from "../../../../infrastructure/api/market/fetchMarketStatistics";
import { MarketStats } from "../../../../domain/valueObjects/marketStats";
import { UserBalance } from "../../../../domain/valueObjects/userBalance";

export const useMarketStats = () => {
  const [stats, setStats] = useState<MarketStats | null>(null);

  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);

  const loadStatsAndBalances = async () => {
    try {
      const [userData, statsData] = await Promise.all([
        fetchUserBalances(),
        fetchMarketStatistics()
      ]);

      setStats(statsData);
      setUserBalance({ usdBalance: userData.usdBalance, btcBalance: userData.btcBalance });
    } catch (error) {
      console.error("Failed to fetch stats or balances", error);
    }
  };

  return { stats, userBalance, setStats, setUserBalance, loadStatsAndBalances };
};

