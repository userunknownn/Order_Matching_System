import { AxiosInstance } from '../axios/AxiosInstance';

export const fetchMatchHistory = async () => {
  const response = await AxiosInstance.get('market/me/matches/recent');
  return response.data;
}

