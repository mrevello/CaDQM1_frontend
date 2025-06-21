import { API_ENDPOINTS, AUTH_CONFIG } from '../constants';
import { instance } from './base.api';

const endpoint = API_ENDPOINTS.AUTH.LOGIN;

export const login = {
  login: async function (username: string, password: string) {
    try {
      const response = await instance.post(endpoint, {
        username: username,
        password: password,
      });
      const { access, refresh } = response.data;

      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, access);
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refresh);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
};
