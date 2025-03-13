import { Problem } from "../types/problem";
import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "quality-problems/";

export type ProblemBody = {
  name: string;
  description: string;
  priority?: number;
  date?: string;
  project_id: number;
};

export const problemsApi = {
  createProblem: async (data: ProblemBody) => {
    try {
      data.priority = data.priority ?? 1;
      data.date = data.date ?? new Date().toISOString().split("T")[0]; // remove the split
      const response = await instance.post(endpoint, data);
      const problemData = response.data;
      const problem: Problem = {
        id: problemData.id,
        name: problemData.name || `Problem ${problemData.id}`,
        description: problemData.description,
      };
      return problem;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  listProblems: async function (projectId: number) {
    try {
      const response = await instance.get(endpoint);
      const problemsData = response.data;
      const problems: Problem[] = problemsData
        .filter((p: any) => p.project === projectId)
        .map((p: any) => ({
          id: p.id,
          name: p.name || `Problem ${p.id}`,
          description: p.description,
        }));

      return problems;
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
