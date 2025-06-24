import axios from 'axios';
import {
  ApplicationDomain,
  BusinessRule,
  componentTypeToKey,
  ContextComponent,
  ContextComponentData,
  ContextComponentsType,
  ContextComponentType,
  createContextComponent,
  DataFiltering,
  DQMetadata,
  DQRequirement,
  emptyContextComponentsType,
  OtherData,
  OtherMetadata,
  SystemRequirement,
  TaskAtHand,
  UserType,
} from '../types/contextComponent';
import { Context, ContextResponse } from '../types/context';
import { Stage } from '../types/stage';
import { instance } from './base.api';
import { handleApiError } from './errorHandler';
import { API_ENDPOINTS } from '../constants';
import { projectsApi } from './projects.api';

const endpoints: Record<keyof typeof ContextComponentType, string> = {
  APPLICATION_DOMAIN: API_ENDPOINTS.CONTEXT.APPLICATION_DOMAIN,
  BUSINESS_RULE: API_ENDPOINTS.CONTEXT.BUSINESS_RULE,
  DATA_FILTERING: API_ENDPOINTS.CONTEXT.DATA_FILTERING,
  DQ_METADATA: API_ENDPOINTS.CONTEXT.DQ_METADATA,
  DQ_REQUIREMENT: API_ENDPOINTS.CONTEXT.DQ_REQUIREMENT,
  OTHER_DATA: API_ENDPOINTS.CONTEXT.OTHER_DATA,
  OTHER_METADATA: API_ENDPOINTS.CONTEXT.OTHER_METADATA,
  SYSTEM_REQUIREMENT: API_ENDPOINTS.CONTEXT.SYSTEM_REQUIREMENT,
  TASK_AT_HAND: API_ENDPOINTS.CONTEXT.TASK_AT_HAND,
  USER_TYPE: API_ENDPOINTS.CONTEXT.USER_TYPE,
};

export const contextApi = {
  getContext: async function (contextId: number): Promise<Context> {
    try {
      const response = await instance.get(`${API_ENDPOINTS.CONTEXT.CONTEXT}${contextId}/`);
      const data: ContextResponse = response.data;

      const previousContext = data.previous_version
        ? await contextApi.getContext(data.previous_version)
        : null;

      const context: Context = {
        id: data.id,
        name: data.name,
        version: data.version,
        previousVersion: previousContext,
      };

      return context;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createContextComponent: async function (
    type: ContextComponentType,
    data: Record<string, any>,
    projectId: number,
    stage?: Stage
  ): Promise<ContextComponent> {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        key => ContextComponentType[key as keyof typeof ContextComponentType] === type
      ) as keyof typeof ContextComponentType;

      if (!typeKey || !endpoints[typeKey]) {
        throw new Error(`Invalid type: ${type}`);
      }

      data.project = projectId;
      data.stage = stage;
      const response = await instance.post(endpoints[typeKey], data);
      return createContextComponent(response.data.id, type, response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          throw error.response.data;
        } else if (error.request) {
          throw new Error(
            'No response received from server. Please check your network connection.'
          );
        }
      }
      throw error;
    }
  },

  updateContextComponent: async (
    contextComponentId: number,
    type: ContextComponentType,
    data: Partial<Record<string, any>>,
    projectId: number
  ): Promise<ContextComponent> => {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        key => ContextComponentType[key as keyof typeof ContextComponentType] === type
      ) as keyof typeof ContextComponentType;

      if (!typeKey || !endpoints[typeKey]) {
        throw new Error(`Invalid type: ${type}`);
      }

      data.project = projectId;
      const response = await instance.put(`${endpoints[typeKey]}${contextComponentId}/`, data);
      return createContextComponent(response.data.id, type, response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          throw error.response.data;
        } else if (error.request) {
          throw new Error(
            'No response received from server. Please check your network connection.'
          );
        }
      }
      throw error;
    }
  },

  getContextComponentByType: async function (
    type: ContextComponentType,
    projectId: number
  ): Promise<ContextComponentData<ContextComponent> | null> {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        key => ContextComponentType[key as keyof typeof ContextComponentType] === type
      ) as keyof typeof ContextComponentType;

      if (!typeKey || !endpoints[typeKey]) {
        throw new Error(`Invalid type: ${type}`);
      }

      const res = await instance.get(endpoints[typeKey]);
      const filteredData = res.data
        .filter((item: any) => item.project === projectId)
        .map((item: any) => {
          const base = {
            id: item.id,
            stage: item.project_stage?.stage || Stage.ST1,
          };

          switch (type) {
            case ContextComponentType.APPLICATION_DOMAIN:
              return {
                ...base,
                description: item.description,
              } as ApplicationDomain;

            case ContextComponentType.BUSINESS_RULE:
              return {
                ...base,
                statement: item.statement,
                semantic: item.semantic,
              } as BusinessRule;

            case ContextComponentType.DATA_FILTERING:
              return {
                ...base,
                statement: item.statement,
                description: item.description,
                task_at_hand: item.task_at_hand,
              } as DataFiltering;

            case ContextComponentType.DQ_METADATA:
              return {
                ...base,
                path: item.path,
                description: item.description,
                measurement: item.measurement,
              } as DQMetadata;

            case ContextComponentType.DQ_REQUIREMENT:
              return {
                ...base,
                statement: item.statement,
                description: item.description,
                data_filtering: item.data_filtering,
                user_type: item.user_type,
              } as DQRequirement;

            case ContextComponentType.OTHER_DATA:
              return {
                ...base,
                path: item.path,
                description: item.description,
                owner: item.owner,
              } as OtherData;

            case ContextComponentType.OTHER_METADATA:
              return {
                ...base,
                path: item.path,
                description: item.description,
                author: item.author,
              } as OtherMetadata;

            case ContextComponentType.SYSTEM_REQUIREMENT:
              return {
                ...base,
                statement: item.statement,
                description: item.description,
              } as SystemRequirement;

            case ContextComponentType.TASK_AT_HAND:
              return {
                ...base,
                name: item.name,
                purpose: item.purpose,
              } as TaskAtHand;

            case ContextComponentType.USER_TYPE:
              return {
                ...base,
                name: item.name,
                characteristics: item.characteristics,
              } as UserType;

            default:
              return base;
          }
        });

      return filteredData.length
        ? {
            type: type,
            data: filteredData,
          }
        : null;
    } catch (error) {
      return null;
    }
  },

  listContextComponents: async function (projectId: number): Promise<ContextComponentsType> {
    try {
      const results: ContextComponentsType = Object.fromEntries(
        await Promise.all(
          (Object.keys(ContextComponentType) as Array<keyof typeof ContextComponentType>).map(
            async key => {
              const type = ContextComponentType[key];
              const data = await contextApi.getContextComponentByType(type, projectId);
              const propName = componentTypeToKey[type];
              return [propName, data];
            }
          )
        )
      ) as ContextComponentsType;
      return results;
    } catch (error) {
      return emptyContextComponentsType;
    }
  },

  deleteComponent: async (id: number, type: ContextComponentType) => {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        key => ContextComponentType[key as keyof typeof ContextComponentType] === type
      ) as keyof typeof ContextComponentType;

      if (!typeKey || !endpoints[typeKey]) {
        throw new Error(`Invalid type: ${type}`);
      }
      await instance.delete(`${endpoints[typeKey]}${id}/`);
      return { success: true, id };
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
