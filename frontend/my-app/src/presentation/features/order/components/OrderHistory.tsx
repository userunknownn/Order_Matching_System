import React from "react";
import { Match } from "../../../../domain/entities/Match";

interface OrderHistoryProps {
  history: Match[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ history }) => {
  return (
    <div className="card p-4 mt-4">
      <h2>My History</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Volume</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((item, idx) => (
              <tr key={idx}>
                <td>US$ {item.price.toFixed(2)}</td>
                <td>{item.volume.toFixed(3)} BTC</td>
                <td className={item.type === "BUY" ? "text-success" : "text-danger"}>
                  {item.type}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">No orders to show on history</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
