import { AxiosInstance } from '../axios/AxiosInstance';

export const fetchGlobalMatches = async () => {
  const response = await AxiosInstance.get("/market/matches/recent");
  return response.data; 
}
