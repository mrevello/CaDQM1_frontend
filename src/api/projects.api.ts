import {
  Project,
  ProjectResponse,
  ProjectBody,
  toProject,
} from "../types/project";
import { Stage } from "../types/stage";
import { State } from "../types/state";
import { instance } from "./base.api";
import { dataAtHandApi } from "./dataAtHand.api";
import { handleApiError } from "./errorHandler";

const endpoint = "projects/";

export const projectsApi = {
  listProjects: async function (): Promise<Project[]> {
    try {
      const response = await instance.get(endpoint);
      const projectResponses: ProjectResponse[] = response.data;

      const projects: Project[] = await Promise.all(
        projectResponses.map(async (resp) => {
          const dataAtHand = resp.data_at_hand
            ? await dataAtHandApi.getDataAtHand(resp.data_at_hand)
            : undefined;

          return toProject(resp, dataAtHand);
        })
      );

      return projects;
    } catch (error: any) {
      return [];
    }
  },

  createProject: async function (
    data: ProjectBody
  ): Promise<Project | undefined> {
    try {
      const response = await instance.post(endpoint, data);
      const resp: ProjectResponse = response.data;

      return toProject(resp, undefined);
    } catch (error: any) {
      handleApiError(error);
    }
  },

  getProject: async function (
    id: number | string
  ): Promise<Project | undefined> {
    try {
      const response = await instance.get(`${endpoint}${id}/`);
      const resp: ProjectResponse = response.data;

      const dataAtHand = resp.data_at_hand
        ? await dataAtHandApi.getDataAtHand(resp.data_at_hand)
        : undefined;

      return toProject(resp, dataAtHand);
    } catch (error: any) {
      return undefined;
    }
  },

  updateProject: async function (
    id: number | string,
    data: Partial<ProjectBody>
  ) {
    try {
      const response = await instance.put(`${endpoint}${id}/`, data);
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

  updateStage: async function (
    id: number | string,
    stage: Stage,
    status: State
  ) {
    try {
      const data = { stage, status };
      const response = await instance.put(
        `${endpoint}${id}/update-stage/`,
        data
      );
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
