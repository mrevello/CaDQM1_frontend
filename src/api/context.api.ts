import axios from "axios";
import {
  ApplicationDomain,
  BusinessRule,
  ContextComponent,
  ContextComponentData,
  ContextComponentsType,
  ContextComponentType,
  DataFiltering,
  DQMetadata,
  DQRequirement,
  OtherData,
  OtherMetadata,
  SystemRequirement,
  TaskAtHand,
  UserType,
} from "../types/contextComponent";
import { Stage } from "../types/stage";
import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoints: Record<keyof typeof ContextComponentType, string> = {
  APPLICATION_DOMAIN: "application-domains/",
  BUSINESS_RULE: "business-rules/",
  DATA_FILTERING: "data-filtering/",
  DQ_METADATA: "dq-metadata/",
  DQ_REQUIREMENT: "dq-requirements/",
  OTHER_DATA: "other-data/",
  OTHER_METADATA: "other-metadata/",
  SYSTEM_REQUIREMENT: "system-requirements/",
  TASK_AT_HAND: "task-at-hand/",
  USER_TYPE: "user-types/",
};

const requiredFields: Record<keyof typeof ContextComponentType, string[]> = {
  APPLICATION_DOMAIN: ["id", "description"],
  BUSINESS_RULE: ["id", "statement", "semantic"],
  DATA_FILTERING: ["id", "statement", "description", "task_at_hand"],
  DQ_METADATA: ["id", "path", "description", "measurement"],
  DQ_REQUIREMENT: [
    "id",
    "statement",
    "description",
    "data_filtering",
    "user_type",
  ],
  OTHER_DATA: ["id", "path", "description", "owner"],
  OTHER_METADATA: ["id", "path", "description", "author"],
  SYSTEM_REQUIREMENT: ["id", "statement", "description"],
  TASK_AT_HAND: ["id", "name", "purpose"],
  USER_TYPE: ["id", "name", "characteristics"],
};

export const contextApi = {
  createContextComponent: async function (
    type: ContextComponentType,
    data: Record<string, any>,
    projectId: number,
    stage?: Stage
  ): Promise<any> {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        (key) =>
          ContextComponentType[key as keyof typeof ContextComponentType] ===
          type
      ) as keyof typeof ContextComponentType;

      if (!typeKey || !endpoints[typeKey]) {
        throw new Error(`Invalid type: ${type}`);
      }

      data.project = projectId;
      data.stage = stage;
      const response = await instance.post(endpoints[typeKey], data);
      return response.data;
    } catch (error) {
      console.log("Error creating context component", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data) {
            throw new Error(error.response.data);
          }
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

  updateContextComponent: async (
    contextComponentId: number,
    type: ContextComponentType,
    data: Partial<Record<string, any>>,
    projectId: number
  ) => {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        (key) =>
          ContextComponentType[key as keyof typeof ContextComponentType] ===
          type
      ) as keyof typeof ContextComponentType;

      if (!typeKey || !endpoints[typeKey]) {
        throw new Error(`Invalid type: ${type}`);
      }

      data.project = projectId;
      const response = await instance.put(
        `${endpoints[typeKey]}${contextComponentId}/`,
        data
      );
      return response.data;
    } catch (error: any) {
      // handleApiError(error);
    }
  },

  getContextComponentByType: async function (
    type: ContextComponentType,
    projectId: number
  ): Promise<ContextComponentData<ContextComponent> | null> {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        (key) =>
          ContextComponentType[key as keyof typeof ContextComponentType] ===
          type
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

  listContextComponents: async function (
    projectId: number
  ): Promise<ContextComponentsType | null> {
    try {
      const keys = Object.keys(
        ContextComponentType
      ) as (keyof typeof ContextComponentType)[];

      const results = await Promise.all(
        keys.map(async (key) => {
          const type = ContextComponentType[key];
          const data = await contextApi.getContextComponentByType(
            type,
            projectId
          );
          return data;
        })
      );

      if (results.every((result) => result === null)) {
        return null;
      }

      const contextComponents: ContextComponentsType = keys.reduce(
        (acc, key, index) => {
          acc[key.toLowerCase() as keyof ContextComponentsType] = results[
            index
          ] as any;
          return acc;
        },
        {} as ContextComponentsType
      );

      return contextComponents;
    } catch (error) {
      return null;
    }
  },

  deleteComponent: async (id: number, type: ContextComponentType) => {
    try {
      const typeKey = Object.keys(ContextComponentType).find(
        (key) =>
          ContextComponentType[key as keyof typeof ContextComponentType] ===
          type
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
