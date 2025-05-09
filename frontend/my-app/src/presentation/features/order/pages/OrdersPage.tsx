import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMarketStats } from "../hooks/useMarketStats";
import { useUserOrders } from "../hooks/useUserOrders";
import { useMarketData } from "../hooks/useMarketData";
import { useSocketSubscriptions } from "../hooks/useSocketSubscriptions";

import StatisticsCard from "../components/StatisticsCard";
import BuyAndSellForm from "../components/BuyAndSellForm";
import GlobalMatches from "../components/GlobalMatches";
import ActiveOrders from "../components/ActiveOrders";
import OrderBook from "../components/OrderBook";
import OrderHistory from "../components/OrderHistory";
import Section from "../../../components/shared/Section";

const OrdersPage: React.FC = () => {
  const { user, logout, socket } = useAuth();
  const navigate = useNavigate();

  const [buyPrice, setBuyPrice] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  const { stats, userBalance, setStats, setUserBalance, loadStatsAndBalances } = useMarketStats();

  const {
    ordersFromOrderBook,
    setOrdersFromOrderBook,
    globalMatches,
    setGlobalMatches,
    loadOrderBook,
    loadMatches,
  } = useMarketData();

  const {
    userActiveOrders,
    setUserActiveOrders,
    userMatchHistory,
    setUserMatchHistory,
    loadOrders,
    handleNewOrder,
    handleCancelOrder
  } = useUserOrders();


  useEffect(() => {
    loadStatsAndBalances();
    loadMatches();
    loadOrders();
    loadOrderBook();
  }, []);

  useSocketSubscriptions({
    socket,
    setStats,
    setUserBalance,
    setOrdersFromOrderBook,
    setUserActiveOrders,
    setGlobalMatches,
    setUserMatchHistory
  });

  const handleSelectFromOrderBook = (price: number, amount: number, type: string) => {
    if (type === "Buy") {
      setSellPrice(price.toString());
      setSellAmount(amount.toString());
    } else {
      setBuyPrice(price.toString());
      setBuyAmount(amount.toString());
    }
  };

  if (!stats || !userBalance) return <div>Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Orders</h1>
        <div>
          <span className="me-3">Welcome, {user?.username}</span>
          <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate("/"); }}>
            Logout
          </button>
        </div>
      </div>

      <StatisticsCard stats={{ ...stats, ...userBalance }} />

      <Section title="Buy & Sell">
        <div className="row mb-4">
          <BuyAndSellForm
            type="Buy"
            priceValue={buyPrice}
            priceHandler={setBuyPrice}
            amountValue={buyAmount}
            amountHandler={setBuyAmount}
            handleOrder={handleNewOrder}
          />
          <BuyAndSellForm
            type="Sell"
            priceValue={sellPrice}
            priceHandler={setSellPrice}
            amountValue={sellAmount}
            amountHandler={setSellAmount}
            handleOrder={handleNewOrder}
          />
        </div>
      </Section>

      <Section title="Global Activity">
        <GlobalMatches matches={globalMatches} />
      </Section>

      <Section title="Your Orders">
        <ActiveOrders orders={userActiveOrders} onCancel={handleCancelOrder} />
      </Section>

      <Section title="Order Book">
        <OrderBook orders={ordersFromOrderBook} onSelect={handleSelectFromOrderBook} />
      </Section>

      <Section title="Order History">
        <OrderHistory history={userMatchHistory} />
      </Section>
    </div>
  );
};

export default OrdersPage;


