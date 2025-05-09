import { AxiosInstance } from '../axios/AxiosInstance';

export const cancelOrder = async (orderId: string) => {
  await AxiosInstance.patch(`/orders/${orderId}/cancel`);
}

