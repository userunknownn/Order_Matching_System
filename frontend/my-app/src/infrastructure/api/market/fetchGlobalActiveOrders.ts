import { AxiosInstance } from '../axios/AxiosInstance';

export const fetchGlobalActiveOrders = async () => {
  const response = await AxiosInstance.get('/orders/active');
  return response.data;
}
