export interface Order {
  id: string;
  price: string;
  amount: string;
  type: 'BUY' | 'SELL';
}
