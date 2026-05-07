import axios from 'axios';
import Cookies from 'js-cookie';
import useAdminStore from '../store/useAdminStore';

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  baseURL: 'https://madeena-api.madeenarestaurant.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      useAdminStore.getState().setSessionExpired(true);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
