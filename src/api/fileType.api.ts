import { S } from "framer-motion/dist/types.d-DDSxwf0n";
import { FileType } from "../types/file";
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

export const endpoint = "file-types/";

export const fileTypesApi = {
  listFileTypes: async function (): Promise<FileType[]> {
    try {
      const response = await instance.get(endpoint);
      console.log(response);
      const all: FileType[] = response.data;
      const seen = new Set<string>();
      const distinct = all.filter((ft) => {
        if (seen.has(ft.type)) return false;
        seen.add(ft.type);
        return true;
      });

      return distinct;
    } catch (error: any) {
      return [];
    }
  },

  createFileType: async function (type: string): Promise<FileType | undefined> {
    try {
      const response = await instance.post(`${endpoint}create/`, {
        type: type,
      });
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  },
};
