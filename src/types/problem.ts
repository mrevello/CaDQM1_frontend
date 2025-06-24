import { ProjectStage } from './project';
import { Stage } from './stage';

export interface Problem {
  id: number;
  description: string;
  date: Date;
  isSuggestion?: boolean;
  stage?: Stage;
}

export type ProblemErrorsType = {
  id?: string;
  description?: string;
  date?: string;
};

export type ProblemResponse = {
  quality_problem_id: number;
  description: string;
  date: Date;
  project_stage?: ProjectStage;
};
