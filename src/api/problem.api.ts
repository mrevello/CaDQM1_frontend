import { Problem, ProblemResponse } from '../types/problem';
import { instance } from './base.api';
import { handleApiError } from './errorHandler';
import { Stage } from '../types/stage';
import { API_ENDPOINTS } from '../constants';
import { projectsApi } from './projects.api';

const endpoint = API_ENDPOINTS.DATA_QUALITY.PROBLEMS;

export type ProblemBody = {
  description: string;
  priority?: number;
  date?: string;
  project_id: number;
  project_stage?: number;
};

export const problemsApi = {
  createProblem: async (description: string, projectId: number, stage?: Stage) => {
    try {
      const project = await projectsApi.getProject(projectId);

      if (!project) {
        console.error('Error: No project found');
        return;
      }

      const projectStage = project.stages.find(ps => ps.stage === stage);

      if (!projectStage) {
        console.error('Error: No project stage found');
        return;
      }
      const data: ProblemBody = {
        description,
        project_id: projectId,
        project_stage: projectStage.id,
        priority: 1,
        date: new Date().toISOString().split('T')[0],
      };

      const response = await instance.post(endpoint, data);
      const problemData = response.data;
      const problem: Problem = {
        id: problemData.id,
        description: problemData.description,
        date: problemData.date,
        stage: problemData.stage,
      };
      return problem;
    } catch (error: any) {
      handleApiError(error);
    }
  },

  listProblems: async function (projectId: number, stage?: Stage): Promise<Problem[]> {
    try {
      const response = await instance.get(`${endpoint}by-project/${projectId}/`);
      const problemsData: ProblemResponse[] = response.data;
      console.log('problemsData', problemsData);
      const problems: Problem[] = problemsData
        .filter(p => (stage ? p.project_stage?.stage === stage : true))
        .map((p: ProblemResponse) => ({
          id: p.quality_problem_id,
          description: p.description,
          date: p.date,
          stage: p.project_stage?.stage || Stage.ST1,
        }));

      return problems;
    } catch (error: any) {
      console.log(`Error fetching problems for project ${projectId}`, error);
      return [];
    }
  },

  updateProblem: async (
    problemId: number,
    description: string,
    projectId: number
  ): Promise<Problem | null> => {
    try {
      const data = {
        description,
        date: new Date().toISOString().split('T')[0],
        project_id: projectId,
      };
      const response = await instance.put(`${endpoint}${problemId}/`, data);
      const problemData = response.data;
      const problem: Problem = {
        id: problemData.id || problemData.quality_problem_id,
        description: problemData.description,
        date: problemData.date,
      };
      return problem;
    } catch (error: any) {
      console.log(`Error updating problem ${problemId}`, error);
      return null;
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
