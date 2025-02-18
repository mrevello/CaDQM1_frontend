import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";

const BASE_URL = "http://localhost:8000/api/";

export const instance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to attach the access token to each request
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh the token on 401 errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (refreshToken) {
          const { data } = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = data.access;
          const newRefreshToken = data.refresh;
          localStorage.setItem(ACCESS_TOKEN, newAccessToken);
          localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
