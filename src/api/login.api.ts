import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import { instance } from "./base.api";

const endpoint = "login/";

export const login = {
  login: async function (username: string, password: string) {
    try {
      const response = await instance.post(endpoint, {
        username: username,
        password: password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },
};
