import { useState } from "react";
import { createOrder } from "../../../../infrastructure/api/order/createOrder";
import { cancelOrder } from "../../../../infrastructure/api/order/cancelOrder";
import { fetchActiveOrders } from "../../../../infrastructure/api/user/fetchActiveOrders";
import { fetchMatchHistory } from "../../../../infrastructure/api/user/fetchMatchHistory";
import { Order } from "../../../../domain/entities/Order";
import { Match } from "../../../../domain/entities/Match";

export const useUserOrders = () => {
  const [userActiveOrders, setUserActiveOrders] = useState<Order[]>([]);
  const [userMatchHistory, setUserMatchHistory] = useState<Match[]>([]);

  const loadOrders = async () => {
    try {
      const [myActiveOrders, myMatchHistory] = await Promise.all([
        fetchActiveOrders(),
        fetchMatchHistory(),
      ]);

      setUserActiveOrders(myActiveOrders);
      setUserMatchHistory(
        myMatchHistory.map((match: Match) => ({
          price: match.price,
          volume: match.volume,
          type: match.type,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleNewOrder = async (amount: string, price: string, type: string) => {
    try {
      await createOrder(parseFloat(amount), parseFloat(price), type.toUpperCase());
    } catch (error) {
      console.error("Error on creating order", error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      setUserActiveOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Error on cancel order:", error);
    }
  };

  return {
    userActiveOrders,
    setUserActiveOrders,
    userMatchHistory,
    setUserMatchHistory,
    loadOrders,
    handleNewOrder,
    handleCancelOrder
  };
};

