import axios from "axios";
import { instance } from "./base.api";

const endpoint = "projects/";

export const projects = {
  listProjects: async function () {
    try {
      const response = await instance.get(endpoint);
      console.log("projects response", response.data);

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          throw new Error(error.response.data.error);
        } else if (error.request) {
          throw new Error(
            "No response received from server. Please check your network connection."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
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
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          throw new Error(error.response.data.error);
        } else if (error.request) {
          throw new Error(
            "No response received from server. Please check your network connection."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  // Get project details by id
  getProject: async function (id: number | string) {
    try {
      const response = await instance.get(`${endpoint}${id}/`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          throw new Error(error.response.data.error);
        } else if (error.request) {
          throw new Error(
            "No response received from server. Please check your network connection."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  // Update a project by id
  updateProject: async function (id: number | string, projectData: object) {
    try {
      const response = await instance.put(`${endpoint}${id}/`, projectData);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          throw new Error(error.response.data.error);
        } else if (error.request) {
          throw new Error(
            "No response received from server. Please check your network connection."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  // Delete a project by id
  deleteProject: async function (id: number | string) {
    try {
      const response = await instance.delete(`${endpoint}${id}/`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          throw new Error(error.response.data.error);
        } else if (error.request) {
          throw new Error(
            "No response received from server. Please check your network connection."
          );
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },
};
