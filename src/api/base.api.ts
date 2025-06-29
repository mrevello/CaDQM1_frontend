import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError } from './errorHandler';
import { API_CONFIG, API_ENDPOINTS, AUTH_CONFIG, ROUTES } from '../constants';

export const instance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 20000, // 20 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const originalRequest = error.config;

    // Handle token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
          refresh: refreshToken,
        });

        const { access, refresh } = data;
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, access);
        localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API responses
export const handleResponse = <T>(response: AxiosResponse<T>): T => {
  try {
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
