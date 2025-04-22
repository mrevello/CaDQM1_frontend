import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "data-at-hand/";

export type DataAtHandBody = {
  name: string;
  description: string;
  url_db: string;
  user_db: string;
  pass_db: string;
  project: number;
  date?: string;
};

export type DataAtHandApiResponse = {
  id: number;
  name: string;
  description: string;
  url_db: string;
  user_db: string;
  pass_db: string;
};

export const dataAtHandApi = {
  createDataAtHand: async (data: DataAtHandBody) => {
    try {
      data.date = data.date ?? new Date().toISOString().split("T")[0];
      const response = await instance.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  getDataAtHand: async (id: number) => {
    try {
      const response = await instance.get(`${endpoint}${id}/`);
      return response.data;
    } catch (error: any) {
      console.log("Error fectching data at hand:", error);
    }
  },

  updateDataAtHand: async (id: number, data: DataAtHandBody) => {
    try {
      data.date = data.date ?? new Date().toISOString().split("T")[0];
      const response = await instance.put(`${endpoint}${id}/`, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
