import { AxiosInstance } from '../axios/AxiosInstance';

export const fetchActiveOrders = async () => {
  const response = await AxiosInstance.get('/orders/me/active');
  return response.data;
}
