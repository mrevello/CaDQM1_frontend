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
