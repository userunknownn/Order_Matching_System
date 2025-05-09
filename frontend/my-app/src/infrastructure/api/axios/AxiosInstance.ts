import axios from 'axios';

export const AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000', 
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
