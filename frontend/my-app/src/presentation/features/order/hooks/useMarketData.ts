import { useState } from "react";
import { fetchGlobalActiveOrders } from "../../../../infrastructure/api/market/fetchGlobalActiveOrders";
import { fetchGlobalMatches } from "../../../../infrastructure/api/market/fetchGlobalMatches";
import { Order } from "../../../../domain/entities/Order";
import { Match } from "../../../../domain/entities/Match";

export const useMarketData = () => {
  const [ordersFromOrderBook, setOrdersFromOrderBook] = useState<Order[]>([]);
  const [globalMatches, setGlobalMatches] = useState<Match[]>([]);

  const loadOrderBook = async () => {
    try {
      const orders = await fetchGlobalActiveOrders();
      setOrdersFromOrderBook(orders);
    } catch (error) {
      console.error("Error on loading order book", error);
    }
  };

  const loadMatches = async () => {
    try {
      const matches = await fetchGlobalMatches();
      setGlobalMatches(matches);
    } catch (error) {
      console.error("Error on loading global matches", error);
    }
  };

  return {
    ordersFromOrderBook,
    setOrdersFromOrderBook,
    globalMatches,
    setGlobalMatches,
    loadOrderBook,
    loadMatches,
  };
};

