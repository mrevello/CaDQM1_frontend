import { Estimation, EstimationResponse, EstimationType } from '../types/estimation';
import { instance } from './base.api';
import { endpoint as projectsEndpoint } from './projects.api';
import { API_ENDPOINTS } from '../constants';

export const endpoint = API_ENDPOINTS.ESTIMATION;

export const estimationApi = {
  getEstimation: async function (projectId: number): Promise<Estimation> {
    const response = await instance.post(`${projectsEndpoint}${projectId}/estimation/`, {
      regenerate: false,
      prompt: '',
    });

    const estimation: EstimationResponse = response.data;
    return {
      id: estimation.estimation_id,
      text: estimation.manual_facts.join('\n'),
      warnings: estimation.estimation?.warnings?.length
        ? estimation.estimation?.warnings
        : undefined,
      facts: estimation.estimation?.facts?.length ? estimation.estimation?.facts : undefined,
    };
  },

  regenerateEstimation: async function (projectId: number): Promise<Estimation> {
    const response = await instance.post(`${projectsEndpoint}${projectId}/estimation/`, {
      regenerate: true,
    });

    const estimation: EstimationResponse = response.data;
    return {
      id: estimation.estimation_id,
      text: estimation.manual_facts.join('\n'),
      warnings: estimation.estimation?.warnings?.length
        ? estimation.estimation?.warnings
        : undefined,
      facts: estimation.estimation?.facts?.length ? estimation.estimation?.facts : undefined,
    };
  },

  discardEstimation: async function (
    estimationId: number,
    text: string,
    type: EstimationType
  ): Promise<Estimation> {
    const response = await instance.post(`${endpoint}discard-item/`, {
      estimation_id: estimationId,
      text_to_discard: text,
      type: type,
    });

    const estimation: EstimationResponse = response.data;
    return {
      id: estimation.estimation_id,
      text: estimation.manual_facts.join('\n'),
      warnings: estimation.estimation?.warnings?.length
        ? estimation.estimation?.warnings
        : undefined,
      facts: estimation.estimation?.facts?.length ? estimation.estimation?.facts : undefined,
    };
  },

  addEstimation: async function (projectId: number, text: string): Promise<Estimation> {
    const response = await instance.post(`${endpoint}add-fact/`, {
      project_id: projectId,
      fact_text: text,
    });

    const estimation: EstimationResponse = response.data;
    return {
      id: estimation.estimation_id,
      text: estimation.manual_facts.join('\n'),
      warnings: estimation.estimation?.warnings?.length
        ? estimation.estimation?.warnings
        : undefined,
      facts: estimation.estimation?.facts?.length ? estimation.estimation?.facts : undefined,
    };
  },
};
