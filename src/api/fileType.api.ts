import { instance } from './base.api';
import { FileType } from '../types/file';
import { API_ENDPOINTS } from '../constants';

export const endpoint = API_ENDPOINTS.FILES.TYPES;

export const fileTypesApi = {
  listFileTypes: async function (): Promise<FileType[]> {
    try {
      const response = await instance.get(endpoint);
      console.log(response);
      const all: FileType[] = response.data;
      const seen = new Set<string>();
      const distinct = all.filter(ft => {
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
