import { Problem } from "../types/problem";
import { instance } from "./base.api";
import { handleApiError } from "./errorHandler";

const endpoint = "quality-problems/";

export type ProblemBody = {
  description: string;
  priority?: number;
  date?: string;
  project_id: number;
};

export const problemsApi = {
  createProblem: async (data: ProblemBody) => {
    try {
      data.priority = data.priority ?? 1;
      data.date = data.date ?? new Date().toISOString().split("T")[0];
      const response = await instance.post(endpoint, data);
      const problemData = response.data;
      const problem: Problem = {
        id: problemData.id,
        description: problemData.description,
        date: problemData.date,
      };
      return problem;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  listProblems: async function (projectId: number) {
    try {
      const response = await instance.get(
        `${endpoint}by-project/${projectId}/`
      );
      const problemsData = response.data;
      const problems: Problem[] = problemsData.map((p: any) => ({
        id: p.quality_problem_id,
        description: p.description,
        date: p.date,
      }));

      console.log(problems);
      return problems;
    } catch (error: any) {
      console.log(`Error fetching problems for project ${projectId}`, error);
    }
  },

  updateProblem: async (
    problemId: number,
    data: Partial<ProblemBody>,
    projectId: number
  ) => {
    try {
      data.date = new Date().toISOString().split("T")[0];
      data.project_id = projectId;
      const response = await instance.put(`${endpoint}${problemId}/`, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  deleteProblem: async (id: number) => {
    try {
      await instance.delete(`${endpoint}${id}/`);
      return { success: true, id };
    } catch (error: any) {
      handleApiError(error);
    }
  },
};
