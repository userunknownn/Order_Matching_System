import { AxiosInstance } from '../axios/AxiosInstance';
import { User } from '../../../domain/entities/User';

export const fetchUserBalances = async (): Promise<User> => {
  const response = await AxiosInstance.get<User>(`/user/balances`);
  return response.data;
};
