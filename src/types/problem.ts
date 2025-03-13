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

export const mockProblems: Problem[] = [
  {
    id: 1,
    name: "Problem 1",
    description: "description of Problem 1",
  },
  {
    id: 2,
    name: "Problem 2",
    description:
      "description of Problem 2 with desc large large large em 2 with desc large large largeem 2 with desc large large large",
  },
  {
    id: 3,
    name: "Problem 3",
    description: "description of Problem 3",
  },
  {
    id: 4,
    name: "Problem 4",
    description: "description of Problem 4",
  },
];
