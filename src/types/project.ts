import { Activity } from "./activity";
import { ContextType } from "./context";
import { DataAtHand } from "./dataAtHand";
import { DQModel } from "./model";
import { getStageActivities, Stage, stageOrder } from "./stage";
import { State } from "./state";

// ui model
export type Project = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  context?: ContextType;
  dqModel?: DQModel;
  dataAtHand?: DataAtHand;
  stages: ProjectStage[];
};

export type ProjectStage = {
  stage: Stage;
  status: State;
};

export type ProjectErrorsType = {
  name?: string;
};

export const projectStatus = (stages: ProjectStage[]): State => {
  if (stages.every((stage) => stage.status === State.DONE)) {
    return State.DONE;
  } else if (stages.every((stage) => stage.status === State.TO_DO)) {
    return State.TO_DO;
  } else {
    return State.IN_PROGRESS;
  }
};

export const projectLink = (project: Project, stage?: Stage) => {
  const nextStage = stage || project.stages[0].stage;
  const activities = getStageActivities(nextStage);
  const firstActivity = activities[0];
  return link(project.id.toString(), nextStage, firstActivity);
};

export const link = (projectId: string, stage: Stage, activity: Activity) => {
  return `/projects/${projectId}/${stage.toLowerCase()}/${activity.toLowerCase()}`;
};

// body
export type ProjectBody = {
  name: string;
  description: string;
};

// response
export type ProjectResponse = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  context_id: number;
  data_at_hand: number;
  stages: ProjectStageResponse[];
};

export type ProjectStageResponse = {
  id: string;
  stage: Stage;
  status: State;
};

export function toProject(
  response: ProjectResponse,
  dataAtHand?: DataAtHand
): Project {
  const mappedStages: ProjectStage[] = response.stages.map((s) => ({
    stage: s.stage,
    status: s.status,
  }));

  for (const required of [Stage.ST1, Stage.ST2, Stage.ST3] as const) {
    if (!mappedStages.some((ms) => ms.stage === required)) {
      mappedStages.push({
        stage: required,
        status: State.TO_DO,
      });
    }
  }

  const orderMap: Record<Stage, number> = stageOrder.reduce(
    (acc: Record<Stage, number>, stage: Stage, idx: number) => {
      acc[stage] = idx;
      return acc;
    },
    {} as Record<Stage, number>
  );

  mappedStages.sort((a, b) => orderMap[a.stage] - orderMap[b.stage]);

  return {
    ...response,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
    dataAtHand: dataAtHand,
    stages: mappedStages,
  };
}
