import { Match } from './match.entity';

export function getStatsBasedOnMatches(matches: Match[]) {
  if (matches.length === 0) {
    return {
      lastPrice: 0,
      btcVolume: 0,
      usdVolume: 0,
      high: 0,
      low: 0,
    };
  }

  const sortedByTime = [...matches].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );

  const lastPrice = sortedByTime[0].price;
  const prices = matches.map((o) => o.price);
  const btcVolume = matches.reduce((sum, o) => sum + o.volume, 0);
  const usdVolume = matches.reduce((sum, o) => sum + o.price, 0);

  return {
    lastPrice,
    btcVolume,
    usdVolume,
    high: Math.max(...prices),
    low: Math.min(...prices),
  };
}
