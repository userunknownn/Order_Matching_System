import React, { useState } from "react";
import { Order } from "../../../../domain/entities/Order";

interface ActiveOrdersProps {
  orders: Order[];
  onCancel: (id: string) => Promise<void>;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ orders, onCancel }) => {

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setLoadingId(id);
    try {
      await onCancel(id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h2>My Active Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Amount (BTC)</th>
            <th>Price (USD)</th>
            <th>Type</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{Number(order.amount).toFixed(3)}</td>
              <td>${Number(order.price).toFixed(2)}</td>
              <td>
                <span className={`badge ${order.type === "BUY" ? "bg-success" : "bg-danger"}`}>
                  {order.type}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleCancel(order.id)}
                  disabled={loadingId === order.id}
                >
                  {loadingId === order.id ? "Loading..." : "X"}
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center">No active orders</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveOrders;
