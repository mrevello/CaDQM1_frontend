import { Activity } from "./activity";

export enum Stage {
  ST1 = "ST1",
  ST2 = "ST2",
  ST3 = "ST3",
  ST4 = "ST4",
  ST5 = "ST5",
  ST6 = "ST6",
}

const STAGE_ACTIVITY_MAP: Record<Stage, Activity[]> = {
  [Stage.ST1]: [Activity.A01, Activity.A02, Activity.A03, Activity.A04],
  [Stage.ST2]: [Activity.A03, Activity.A05, Activity.A06],
  [Stage.ST3]: [Activity.A03, Activity.A07],
  [Stage.ST4]: [],
  [Stage.ST5]: [],
  [Stage.ST6]: [],
};

export function getStageActivities(stage: Stage): Activity[] {
  return STAGE_ACTIVITY_MAP[stage] || [];
}

export function getStageName(stage: Stage): string {
  switch (stage) {
    case Stage.ST1:
      return "common:stage-1-name";
    case Stage.ST2:
      return "common:stage-2-name";
    case Stage.ST3:
      return "common:stage-3-name";
    case Stage.ST4:
      return "common:stage-4-name";
    case Stage.ST5:
      return "common:stage-5-name";
    case Stage.ST6:
      return "common:stage-6-name";
  }
}

export function getStageTitle(stage: Stage): string {
  switch (stage) {
    case Stage.ST1:
      return "common:stage-1-title";
    case Stage.ST2:
      return "common:stage-2-title";
    case Stage.ST3:
      return "common:stage-3-title";
    case Stage.ST4:
      return "common:stage-4-title";
    case Stage.ST5:
      return "common:stage-5-title";
    case Stage.ST6:
      return "common:stage-6-title";
  }
};

export const getSteps = (stage: Stage) => {
  switch (stage) {
    case Stage.ST1:
      return [
        { label: "A01", path: "a01" },
        { label: "A02", path: "a02" },
        { label: "A03", path: "a03" },
        { label: "A04", path: "a04" },
      ];
    default:
      return "";
  }
}
