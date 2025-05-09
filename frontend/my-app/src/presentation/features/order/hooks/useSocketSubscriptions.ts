import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { Order } from "../../../../domain/entities/Order";
import { Match } from "../../../../domain/entities/Match";
import { UserBalance } from "../../../../domain/valueObjects/userBalance";
import { MarketStats } from "../../../../domain/valueObjects/marketStats";

interface UseSocketSubscriptionsProps {
  socket: Socket | null;
  setStats: (stats: MarketStats) => void;
  setUserBalance: (balance: UserBalance) => void;
  setOrdersFromOrderBook: (orders: Order[]) => void;
  setUserActiveOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setGlobalMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  setUserMatchHistory: React.Dispatch<React.SetStateAction<Match[]>>;
}

export const useSocketSubscriptions = ({
  socket,
  setStats,
  setUserBalance,
  setOrdersFromOrderBook,
  setUserActiveOrders,
  setGlobalMatches,
  setUserMatchHistory
}: UseSocketSubscriptionsProps) => {
  useEffect(() => {

   const handleSocketEvents = async () =>{
    if (!socket) return;

    const handleStats = (data: any) => setStats(data.payload);
    const handleUserBalance = (data: any) => setUserBalance(data.payload);
    const handleOrderBook = (data: any) => setOrdersFromOrderBook(data.payload);
    const handleRemoveActiveOrder = (data: any) => {
      setUserActiveOrders(prev => prev.filter(order => order.id !== data.payload));
    };
    const handleAddActiveOrder = (data: any) => {
      setUserActiveOrders(prev => {
        const exists = prev.some(order => order.id === data.payload.id);
        return exists ? prev : [...prev, data.payload];
      });
    };
    const handleGlobalMatches = (data: any) => setGlobalMatches(data.payload);
    const handleMatchHistory = (data: any) => setUserMatchHistory(data.payload);

    socket.on("updateStats", handleStats);
    socket.on("updateUserBalances", handleUserBalance);
    socket.on("updateOrderBook", handleOrderBook);
    socket.on("removeActiveOrder", handleRemoveActiveOrder);
    socket.on("addActiveOrder", handleAddActiveOrder);
    socket.on("updateGlobalMatches", handleGlobalMatches);
    socket.on("updateMyMatchHistory", handleMatchHistory);

    return () => {
      socket.off("updateStats", handleStats);
      socket.off("updateUserBalances", handleUserBalance);
      socket.off("updateOrderBook", handleOrderBook);
      socket.off("removeActiveOrder", handleRemoveActiveOrder);
      socket.off("addActiveOrder", handleAddActiveOrder);
      socket.off("updateGlobalMatches", handleGlobalMatches);
      socket.off("updateMyMatchHistory", handleMatchHistory);
    };
  }
  handleSocketEvents();
  }, [socket]);
};

