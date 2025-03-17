import {
  ContextComponentsType,
  ContextComponentType,
} from "../types/contextComponent";
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
    projectId: number
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
      const response = await instance.post(endpoints[typeKey], data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  listContextComponents: async function (
    projectId: number
  ): Promise<ContextComponentsType | null> {
    try {
      const keys = Object.keys(
        endpoints
      ) as (keyof typeof ContextComponentType)[];

      const requests = keys.map(async (key) => {
        try {
          const res = await instance.get(endpoints[key]);
          const filteredData = res.data
            .filter((item: any) => item.project === projectId)
            .map((item: any) => {
              const selectedFields: Partial<typeof item> = {};
              requiredFields[key].forEach((field) => {
                if (field in item) {
                  selectedFields[field] = item[field];
                }
              });
              return selectedFields;
            });

          if (filteredData.length > 0) {
            return {
              type: ContextComponentType[key],
              data: filteredData,
            };
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(requests);

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
      handleApiError(error);
      return null;
    }
  },
};
