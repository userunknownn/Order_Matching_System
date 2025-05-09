import { AxiosInstance } from '../axios/AxiosInstance';

export const fetchMarketStatistics = async () => {
  const response = await AxiosInstance.get('/market/statistics');
  return response.data;
};
