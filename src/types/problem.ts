export interface Problem {
  id: number;
  name: string;
  description: string;
}

export type ProblemErrorsType = {
  id?: string;
  name?: string;
  description?: string;
};
