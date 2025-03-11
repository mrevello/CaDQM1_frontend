import { Activity } from "./activity";

export enum Stage {
  ST1 = "ST1",
  ST2 = "ST2",
  ST3 = "ST3",
  ST4 = "ST4",
  ST5 = "ST5",
  ST6 = "ST6",
  ST7 = "ST7",
  ST8 = "ST8",
  ST9 = "ST9",
}

interface StageInfo {
  name: string;
  title: string;
  description: string;
  activities: Activity[];
}

export const STAGE_INFO: Record<Stage, StageInfo> = {
  [Stage.ST1]: {
    name: "common:stage-1-name",
    title: "common:stage-1-title",
    description: "common:stage-1-description",
    activities: [Activity.A01, Activity.A02, Activity.A03A04],
  },
  [Stage.ST2]: {
    name: "common:stage-2-name",
    title: "common:stage-2-title",
    description: "common:stage-2-description",
    activities: [Activity.A05, Activity.A03A04, Activity.A06], //, Activity.A07],
  },
  [Stage.ST3]: {
    name: "common:stage-3-name",
    title: "common:stage-3-title",
    description: "common:stage-3-description",
    activities: [Activity.A08, Activity.A03A04], //, Activity.A07],
  },
  [Stage.ST4]: {
    name: "common:stage-4-name",
    title: "common:stage-4-title",
    description: "common:stage-4-description",
    activities: [],
  },
  [Stage.ST5]: {
    name: "common:stage-5-name",
    title: "common:stage-5-title",
    description: "common:stage-5-description",
    activities: [],
  },
  [Stage.ST6]: {
    name: "common:stage-6-name",
    title: "common:stage-6-title",
    description: "common:stage-6-description",
    activities: [],
  },
  [Stage.ST7]: {
    name: "",
    title: "",
    description: "",
    activities: [],
  },
  [Stage.ST8]: {
    name: "",
    title: "",
    description: "",
    activities: [],
  },
  [Stage.ST9]: {
    name: "",
    title: "",
    description: "",
    activities: [],
  },
};

export function getStageActivities(stage: Stage): Activity[] {
  return STAGE_INFO[stage]?.activities || [];
}

export function getStageLabel(stage: Stage): string {
  return STAGE_INFO[stage]?.name || "";
}

export function getStageTitle(stage: Stage): string {
  return STAGE_INFO[stage]?.title || "";
}

export function getStageDescription(stage: Stage): string {
  return STAGE_INFO[stage]?.description || "";
}

export function getNextStage(stage: Stage): Stage {
  const stages: Stage[] = Object.values(Stage);
  const currentIndex = stages.indexOf(stage);
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return Stage.ST1;
  }
  return stages[currentIndex + 1];
}
