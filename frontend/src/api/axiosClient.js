import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to automatically attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spk_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('spk_auth_token');
        localStorage.removeItem('spk_current_user');
        window.location.href = '/login?session=expired';
      }
      return Promise.reject(error.response.data || new Error(error.response.statusText));
    }
    return Promise.reject(error);
  }
);

export const shouldUseMock = () => {
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
};

export default axiosClient;
