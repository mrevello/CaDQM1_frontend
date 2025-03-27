import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "data-at-hand/";

export interface DataAtHandBody {
  name: string;
  type?: string;
  description: string;
  url_db: string;
  user_db: string;
  pass_db: string;
  project: number;
  date?: string;
  data_schema?: DataSchema;
}

interface DataSchema {
  name: string;
  description: string;
  tables: string[];
}

export const dataAtHand = {
  createDataAtHand: async (data: DataAtHandBody) => {
    try {
      data.type = data.type ?? "database";
      data.date = data.date ?? new Date().toISOString().split("T")[0];
      data.data_schema = {
        name: "data_schema name",
        description: "data_schema description",
        tables: [],
      };
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
      handleApiError(error);
    }
  },

  updateDataAtHand: async (id: number, data: DataAtHandBody) => {
    try {
      const response = await instance.put(`${endpoint}${id}/`, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
