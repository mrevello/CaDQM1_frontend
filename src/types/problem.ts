export interface Problem {
  id: number;
  description: string;
  date: Date;
}

export type ProblemErrorsType = {
  id?: string;
  description?: string;
  date?: string;
};
