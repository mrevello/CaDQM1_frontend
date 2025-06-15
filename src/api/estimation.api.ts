import { instance } from "./base.api";
import { endpoint as projectsEndpoint } from "./projects.api";

export const endpoint = "estimations/";

export type EstimationType = "warnings" | "facts";

export type EstimationResponse = {
  estimation_id: number;
  estimation: {
    warnings: string[];
    facts: string[];
  };
};

export const estimationApi = {
  getEstimation: async function (
    projectId: number
  ): Promise<EstimationResponse> {
    const response = await instance.post(
      `${projectsEndpoint}${projectId}/estimation/`,
      {
        regenerate: false,
        prompt: "",
      }
    );

    return response.data;
  },

  regenerateEstimation: async function (
    projectId: number,
    prompt: string
  ): Promise<EstimationResponse> {
    const response = await instance.post(
      `${projectsEndpoint}${projectId}/estimation/`,
      {
        regenerate: true,
        prompt: prompt,
      }
    );

    return response.data.estimation;
  },

  discardEstimation: async function (
    estimationId: number,
    text: string,
    type: EstimationType
  ): Promise<EstimationResponse> {
    const response = await instance.post(`${endpoint}discard-item/`, {
      estimation_id: estimationId,
      text_to_discard: text,
      type: type,
    });

    return response.data;
  },

  addEstimation: async function (
    estimationId: number,
    text: string
  ): Promise<EstimationResponse> {
    const response = await instance.post(`${endpoint}add-fact/`, {
      estimation_id: estimationId,
      fact_text: text,
    });

    return response.data;
  },
};
