import React from "react";
import { MarketStats } from "../../../../domain/valueObjects/marketStats";
import { UserBalance } from "../../../../domain/valueObjects/userBalance";

interface StatisticsCardProps {
  stats: MarketStats & UserBalance;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats }) => {
  return (
    <div className="card mb-4 p-4">
      <h2>Statistics</h2>
      <div className="row">
        <div className="col-md-4"><strong>Last Price:</strong> ${stats.lastPrice.toFixed(2)}</div>
        <div className="col-md-4"><strong>BTC Volume:</strong> {stats.btcVolume.toFixed(3)} BTC</div>
        <div className="col-md-4"><strong>USD Volume:</strong> ${stats.usdVolume.toFixed(2)}</div>
        <div className="col-md-4"><strong>High:</strong> ${stats.high.toFixed(2)}</div>
        <div className="col-md-4"><strong>Low:</strong> ${stats.low.toFixed(2)}</div>
        <div className="col-md-4">
          <strong>Your Balances:</strong><br />
          USD: ${stats.usdBalance.toFixed(2)} / BTC: {stats.btcBalance.toFixed(3)}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
