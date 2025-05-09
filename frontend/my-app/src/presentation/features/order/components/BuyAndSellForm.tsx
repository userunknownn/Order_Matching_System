import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";

interface BuyAndSellFormProps {
  type: string;
  handleOrder: (amount: string, price: string, type: string) => void;
  priceValue: string;
  priceHandler:  React.Dispatch<React.SetStateAction<string>>;
  amountValue: string;
  amountHandler:  React.Dispatch<React.SetStateAction<string>>;
}

const BuyAndSellForm: React.FC<BuyAndSellFormProps> = ({ type, handleOrder, priceValue, priceHandler, amountValue, amountHandler }) => {
  const [total, setTotal] = useState<number>(0);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`${type} Order:`, { amountValue, priceValue, total });
    handleOrder(amountValue, priceValue, type);
    amountHandler("");
    priceHandler("");
    setTotal(0);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    amountHandler(value);
    calculateTotal(value, priceValue);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    priceHandler(value);
    calculateTotal(amountValue, value);
  };

  const calculateTotal = (amount: string, price: string) => {
      const amountNum = parseFloat(amount);
      const priceNum = parseFloat(price);

      if (!isNaN(amountNum) && !isNaN(priceNum)) {
        setTotal(amountNum * priceNum);
      } else {
        setTotal(0);
      }
  };


    useEffect(() => {
        calculateTotal(amountValue, priceValue);
    }, [amountValue, priceValue]);


  return (
    <div className="col-md-6">
      <div className="card p-4">
        <h3>{type} BTC</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
          <div className="input-group">
          <span className="input-group-text">BTC</span>
            <input
              type="number"
              placeholder="Amount (BTC)"
              className="form-control"
              value={amountValue}
              onChange={handleAmountChange}
              required
            />
            </div>
          </div>
          <div className="mb-3">
          <div className="input-group">
   		 	<span className="input-group-text">USD</span>
            <input
              type="number"
              placeholder="Price (USD)"
              className="form-control"
              value={priceValue}
              onChange={handlePriceChange}
              required
            />
            </div>
          </div>
          <div className="mb-3">
          	<div className="input-group">
          	<span className="input-group-text">TOTAL</span>
            <input
              type="text"
              className="form-control"
              value={total ? `$${total.toFixed(2)}` : ""}
              disabled
            />
            </div>
          </div>
          <button
            className={`btn ${type === "Buy" ? "btn-success" : "btn-danger"} w-100`}
            type="submit"
          >
            {type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyAndSellForm;

