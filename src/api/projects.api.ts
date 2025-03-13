import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "projects/";

export const projects = {
  listProjects: async function () {
    try {
      const response = await instance.get(endpoint);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  createProject: async function (projectData: {
    name: string;
    description: string;
  }) {
    try {
      const response = await instance.post(endpoint, projectData);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  getProject: async function (id: number | string) {
    try {
      const response = await instance.get(`${endpoint}${id}/`);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  updateProject: async function (id: number | string, projectData: object) {
    try {
      const response = await instance.put(`${endpoint}${id}/`, projectData);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  deleteProject: async function (id: number | string) {
    try {
      const response = await instance.delete(`${endpoint}${id}/`);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
