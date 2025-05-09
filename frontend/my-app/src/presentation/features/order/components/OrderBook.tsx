import React from "react";
import { Order } from "../../../../domain/entities/Order";

interface OrderBookProps {
  orders: Order[];
  onSelect: (price: number, amount: number, type: string) => void;
}

const OrderBook: React.FC<OrderBookProps> = ({ orders, onSelect }) => {

  return (
    <div className="card p-4 mt-4">
      <h2>Order Book</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Volume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, idx) => (
            <tr key={idx}>
              <td className={order.type === "BUY" ? "text-success" : "text-danger"}>
                USD {Number(order.price).toFixed(2)}
              </td>
              <td>{Number(order.amount).toFixed(3)} BTC</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => onSelect(Number(order.price), Number(order.amount), "Buy")}
                  >
                    Bid
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onSelect(Number(order.price), Number(order.amount), "Sell")}
                  >
                    Ask
                  </button>
                </div>
              </td>
            </tr>
            ))
          ) : (
      <tr>
        <td colSpan={3} className="text-center">No orders on Order Book</td>
      </tr>
    )}
       </tbody>
      </table>
    </div>
  );
};

export default OrderBook;

