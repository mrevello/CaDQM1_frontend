import { Stage } from "./stage";

export enum Phase {
  P1 = "phase-1",
  P2 = "phase-2",
  P3 = "phase-3",
}

interface PhaseInfo {
  title: string;
  stages: Stage[];
}

export const PHASE_STAGE_MAP: Record<Phase, PhaseInfo> = {
  [Phase.P1]: {
    title: "phase:phase-1-title",
    stages: [Stage.ST1, Stage.ST2, Stage.ST3],
  },
  [Phase.P2]: {
    title: "phase:phase-2-title",
    stages: [Stage.ST4, Stage.ST5, Stage.ST6],
  },
  [Phase.P3]: {
    title: "phase:phase-3-title",
    stages: [Stage.ST7, Stage.ST8, Stage.ST9],
  },
};

export function getPhaseTitle(phase: Phase): string {
  return PHASE_STAGE_MAP[phase].title || "";
}

export function getPhaseStages(phase: Phase): Stage[] {
  return PHASE_STAGE_MAP[phase].stages || [];
}

export const phases: Phase[] = [Phase.P1, Phase.P2, Phase.P3];
