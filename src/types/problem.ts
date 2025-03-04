export interface Problem {
  id: string;
  name: string;
  description: string;
}

export type ProblemErrorsType = {
  name?: string;
};

export const mockProblems: Problem[] = [
  {
    id: "1",
    name: "Problem 1",
    description: "description of Problem 1",
  },
  {
    id: "2",
    name: "Problem 2",
    description: "description of Problem 2",
  },
  {
    id: "3",
    name: "Problem 3",
    description: "description of Problem 3",
  },
  {
    id: "4",
    name: "Problem 4",
    description: "description of Problem 4",
  },
];
