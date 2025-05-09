import { AxiosInstance } from '../axios/AxiosInstance';

export const createOrder = async (amount: number, price: number, type: string) => {
  const response = await AxiosInstance.post('/orders', {
    amount,
    price,
    type,
  });
  return response.data;
}



